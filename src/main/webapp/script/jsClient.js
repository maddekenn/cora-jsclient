/*
 * Copyright 2016, 2017 Uppsala University Library
 * Copyright 2017 Olov McKie
 *
 * This file is part of Cora.
 *
 *     Cora is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     Cora is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with Cora.  If not, see <http://www.gnu.org/licenses/>.
 */
var CORA = (function(cora) {
	"use strict";
	cora.jsClient = function(dependencies, spec) {
		var out;
		var recordTypeList;

		var recordGuiFactory;
		var jsClientView;
		var managedGuiItemShowing = undefined;
		var managedGuiItemList = [];
		var openGuiItemHandler;

		function start() {
			recordTypeList = sortRecordTypesFromRecordTypeProvider();
			var jsClientViewSpec = {
				"name" : spec.name,
				"serverAddress" : spec.baseUrl
			};
			jsClientView = dependencies.jsClientViewFactory.factor(jsClientViewSpec);

			var loginManagerSpec = {
				"afterLoginMethod" : afterLogin,
				"afterLogoutMethod" : afterLogout,
				"setErrorMessage" : jsClientView.addErrorMessage,
				"appTokenBaseUrl" : spec.appTokenBaseUrl
			};
			var loginManager = dependencies.loginManagerFactory.factor(loginManagerSpec);
			jsClientView.addLoginManagerView(loginManager.getHtml());

			var uploadManagerSpec = {
				"addView" : jsClientView.addGlobalView,
				"showView" : showView
			};

			var recordGuiFactorySpec = dependencies;
			recordGuiFactorySpec.uploadManager = CORA
					.uploadManager(dependencies, uploadManagerSpec);
			recordGuiFactory = CORA.recordGuiFactory(recordGuiFactorySpec);

			createAndAddOpenGuiItemHandlerToSideBar();
			addSearchesUserIsAuthorizedToUseToSideBar(dependencies.searchProvider.getAllSearches());
			addRecordTypesToSideBar(recordTypeList);
		}

		function sortRecordTypesFromRecordTypeProvider() {
			var allRecordTypes = dependencies.recordTypeProvider.getAllRecordTypes();
			var recordTypeLists = sortRecordTypesIntoLists(allRecordTypes);
			var list = [];
			recordTypeLists.abstractList.forEach(function(parent) {
				list.push(parent);
				addChildrenOfCurrentParentToList(parent, recordTypeLists, list);
			});

			list = list.concat(recordTypeLists.noParentList);
			return list;
		}

		function sortRecordTypesIntoLists(unsortedRecordTypes) {
			var recordTypeLists = {};
			recordTypeLists.childList = [];
			recordTypeLists.abstractList = [];
			recordTypeLists.noParentList = [];

			unsortedRecordTypes.forEach(function(recordType) {
				separateAbstractAndNonAbstractRecordTypes(recordTypeLists, recordType);
			});
			return recordTypeLists;
		}

		function separateAbstractAndNonAbstractRecordTypes(recordTypeLists, record) {
			var cRecord = CORA.coraData(record.data);

			if (isAbstract(cRecord)) {
				recordTypeLists.abstractList.push(record);
			} else {
				separateChildrenAndStandaloneRecordTypes(recordTypeLists, cRecord, record);
			}
		}

		function separateChildrenAndStandaloneRecordTypes(recordTypeLists, cRecord, record) {
			if (elementHasParent(cRecord)) {
				recordTypeLists.childList.push(record);
			} else {
				recordTypeLists.noParentList.push(record);
			}
		}

		function isAbstract(cRecord) {
			return cRecord.getFirstAtomicValueByNameInData("abstract") === "true";
		}

		function addChildrenOfCurrentParentToList(parent, recordTypeLists, list) {
			var cParent = CORA.coraData(parent.data);
			var cRecordInfo = CORA.coraData(cParent.getFirstChildByNameInData("recordInfo"));

			recordTypeLists.childList.forEach(function(child) {
				var cChild = CORA.coraData(child.data);
				if (isChildOfCurrentElement(cChild, cRecordInfo)) {
					list.push(child);
				}
			});
		}

		function elementHasParent(cRecord) {
			return cRecord.containsChildWithNameInData("parentId");
		}

		function isChildOfCurrentElement(cChild, cRecordInfo) {
			var cParentIdGroup = CORA.coraData(cChild.getFirstChildByNameInData("parentId"));
			return cParentIdGroup.getFirstAtomicValueByNameInData("linkedRecordId") === cRecordInfo
					.getFirstAtomicValueByNameInData("id");
		}

		function createAndAddOpenGuiItemHandlerToSideBar() {
			openGuiItemHandler = dependencies.openGuiItemHandlerFactory.factor();
			jsClientView.addOpenGuiItemHandlerView(openGuiItemHandler.getView());
		}

		function addSearchesUserIsAuthorizedToUseToSideBar(searchList) {
			searchList.forEach(function(search) {
				possiblyCreateAndAddSearchRecordHandlerToSideBar(search);
			});
		}

		function possiblyCreateAndAddSearchRecordHandlerToSideBar(search) {
			if (userIsAuthorizedToUseSearch(search)) {
				var searchRecordHandler = createSearchRecordHandler(search);
				addSearchRecordHandlerToSideBar(searchRecordHandler);
			}
		}

		function userIsAuthorizedToUseSearch(search) {
			return search.actionLinks.search !== undefined;
		}

		function createSearchRecordHandler(search) {
			var specSearch = {
				"searchRecord" : search,
				"baseUrl" : spec.baseUrl,
				"jsClient" : out,
				"recordGuiFactory" : recordGuiFactory
			};
			return dependencies.searchRecordHandlerFactory.factor(specSearch);
		}

		function addSearchRecordHandlerToSideBar(searchRecordHandler) {
			jsClientView.addToSearchesView(searchRecordHandler.getView());
		}

		function addRecordTypesToSideBar(recordTypeListIn) {
			recordTypeListIn.forEach(function(record) {
				addRecordTypeToSideBar(record);
			});
		}

		function addRecordTypeToSideBar(record) {
			var depRecordHandler = {
				"ajaxCallFactory" : dependencies.ajaxCallFactory,
				"managedGuiItemFactory" : CORA.managedGuiItemFactory(),
				"recordGuiFactory" : recordGuiFactory
			};
			var recordHandlerFactory = CORA.recordHandlerFactory(depRecordHandler);

			var depRecordListHandlerFactory = {
				"ajaxCallFactory" : dependencies.ajaxCallFactory,
				"managedGuiItemFactory" : CORA.managedGuiItemFactory(),
				"recordGuiFactory" : recordGuiFactory,
				"recordHandlerFactory" : recordHandlerFactory
			};

			var dependenciesRecord = {
				"recordTypeHandlerViewFactory" : CORA.recordTypeHandlerViewFactory(),
				"recordListHandlerFactory" : CORA
						.recordListHandlerFactory(depRecordListHandlerFactory),
				"recordHandlerFactory" : recordHandlerFactory,
				"recordGuiFactory" : recordGuiFactory,
				"jsClient" : out,
				"ajaxCallFactory" : dependencies.ajaxCallFactory,
				"managedGuiItemFactory" : CORA.managedGuiItemFactory()
			};
			var specRecord = {
				"recordTypeRecord" : record,
				"baseUrl" : spec.baseUrl
			};
			var recordTypeHandler = CORA.recordTypeHandler(dependenciesRecord, specRecord);
			jsClientView.addToRecordTypesView(recordTypeHandler.getView());
		}

		function getView() {
			return jsClientView.getView();
		}

		function getRecordTypeList() {
			return recordTypeList;
		}

		function showView(managedGuiItem) {
			resetLastShowingMenuItem();
			showNewWorkView(managedGuiItem);
			updateShowingManagedGuiItem(managedGuiItem);
			managedGuiItemShowing = managedGuiItem;
			// openGuiItemHandler.addManagedGuiItem(managedGuiItem);
		}

		function resetLastShowingMenuItem() {
			if (managedGuiItemShowing !== undefined) {
				managedGuiItemShowing.setActive(false);
				managedGuiItemShowing.hideWorkView();
			}
		}

		function showNewWorkView(managedGuiItem) {
			if (managedGuiItem.getWorkView().parentNode !== jsClientView.getWorkView()) {
				jsClientView.addToWorkView(managedGuiItem.getWorkView());
			}
			managedGuiItem.showWorkView();

			removeManagedGuiItemFromList(managedGuiItem);
			managedGuiItemList.push(managedGuiItem);
		}

		function removeManagedGuiItemFromList(managedGuiItem) {
			if (managedGuiItemList.indexOf(managedGuiItem) >= 0) {
				managedGuiItemList.splice(managedGuiItemList.indexOf(managedGuiItem), 1);
			}
		}

		function updateShowingManagedGuiItem(managedGuiItem) {
			managedGuiItem.setActive(true);
		}

		function getMetadataForRecordTypeId(recordTypeId) {
			return dependencies.recordTypeProvider.getMetadataByRecordTypeId(recordTypeId);
		}

		function afterLogin() {
			dependencies.recordTypeProvider.reload(afterRecordTypeProviderReload);
		}
		function afterLogout() {
			dependencies.recordTypeProvider.reload(afterRecordTypeProviderReload);
		}

		function afterRecordTypeProviderReload() {
			jsClientView.clearRecordTypesView();
			recordTypeList = sortRecordTypesFromRecordTypeProvider();
			addRecordTypesToSideBar(recordTypeList);
		}

		function hideAndRemoveView(managedGuiItem) {
			jsClientView.removeFromWorkView(managedGuiItem.getWorkView());
		}

		function viewRemoved(managedGuiItem) {
			removeManagedGuiItemFromList(managedGuiItem);
			var previous = managedGuiItemList.pop();
			if (previous) {
				showView(previous);
			} else {
				resetLastShowingMenuItem();
			}
		}

		out = Object.freeze({
			getView : getView,
			getRecordTypeList : getRecordTypeList,
			showView : showView,
			getMetadataForRecordTypeId : getMetadataForRecordTypeId,
			afterLogin : afterLogin,
			afterLogout : afterLogout,
			afterRecordTypeProviderReload : afterRecordTypeProviderReload,
			hideAndRemoveView : hideAndRemoveView,
			viewRemoved : viewRemoved
		});
		start();

		return out;
	};
	return cora;
}(CORA));
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
		var NO_OF_PROVIDERS = 4;
		var reloadingProvidersInProgress = false;
		var reloadedProviders = 0;

		var metadataProvider = dependencies.providers.metadataProvider;
		var textProvider = dependencies.providers.textProvider;
		var recordTypeProvider = dependencies.providers.recordTypeProvider;
		var searchProvider = dependencies.providers.searchProvider;

		var jsClientView;
		var managedGuiItemShowing = undefined;
		var managedGuiItemList = [];
		var openGuiItemHandler;

		function start() {
			dependencies.globalInstances.clientInstanceProvider.setJsClient(out);
			var jsClientViewSpec = {
				"name" : spec.name,
				"serverAddress" : spec.baseUrl,
				"reloadProvidersMethod" : out.reloadProviders,
				"setLanguageMethod" : out.setCurrentLang
			};
			jsClientView = dependencies.jsClientViewFactory.factor(jsClientViewSpec);

			var loginManager = createLoginManager();

			jsClientView.addLoginManagerView(loginManager.getHtml());

			jsClientView
					.addGlobalView(dependencies.uploadManager.getManagedGuiItem().getMenuView());
			createAndAddOpenGuiItemHandlerToSideBar();
			var publicSearches = searchProvider.getSearchesByGroupId("publicSearch");
			addSearchesUserIsAuthorizedToUseToSideBar(publicSearches);

			createAndAddGroupOfRecordTypesToSideBar();
		}

		function createLoginManager() {
			var loginManagerSpec = {
				"afterLoginMethod" : afterLogin,
				"afterLogoutMethod" : afterLogout,
				"setErrorMessage" : jsClientView.addErrorMessage,
				"appTokenBaseUrl" : spec.appTokenBaseUrl,
				baseUrl : spec.baseUrl
			};
			var loginManager = dependencies.globalFactories.loginManagerFactory
					.factor(loginManagerSpec);
			dependencies.globalInstances.loginManager = loginManager;
			return loginManager;
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
				"jsClient" : out
			};
			return dependencies.searchRecordHandlerFactory.factor(specSearch);
		}

		function addSearchRecordHandlerToSideBar(searchRecordHandler) {
			jsClientView.addToSearchesView(searchRecordHandler.getView());
		}

		function createAndAddGroupOfRecordTypesToSideBar() {
			var thisInstanceOfJsClient = out;
			var recordTypeGroups = dependencies.recordTypeMenu
					.getRecordTypeGroups(thisInstanceOfJsClient);
			addAllRecordTypeGroupsToSideBarInView(recordTypeGroups);
		}

		function addAllRecordTypeGroupsToSideBarInView(recordTypeGroups) {
			recordTypeGroups.forEach(function(recordTypeGroup) {
				jsClientView.addGroupOfRecordTypesToView(recordTypeGroup);
			});
		}

		function getView() {
			return jsClientView.getView();
		}

		function showView(managedGuiItem) {
			resetLastShowingMenuItem();
			showNewWorkView(managedGuiItem);
			updateShowingManagedGuiItem(managedGuiItem);
			managedGuiItemShowing = managedGuiItem;
		}

		function addGuiItem(managedGuiItem) {
			openGuiItemHandler.addManagedGuiItem(managedGuiItem);
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
			return recordTypeProvider.getMetadataByRecordTypeId(recordTypeId);
		}

		function afterLogin() {
			recordTypeProvider.reload(afterRecordTypeProviderReload);
		}
		function afterLogout() {
			recordTypeProvider.reload(afterRecordTypeProviderReload);
		}

		function afterRecordTypeProviderReload() {
			jsClientView.clearRecordTypesView();
			createAndAddGroupOfRecordTypesToSideBar();
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

		function openRecordUsingReadLink(openInfo) {
			var record = {
				"actionLinks" : {
					"read" : openInfo.readLink
				}
			};
			var recordHandlerSpec = {
				"fetchLatestDataFromServer" : "true",
				"partOfList" : "false",
				"createNewRecord" : "false",
				"record" : record,
				"jsClient" : out
			};
			var recordHandlerNew = dependencies.globalFactories.recordHandlerFactory
					.factor(recordHandlerSpec);
			addGuiItem(recordHandlerNew.getManagedGuiItem());
			if (openInfo.loadInBackground !== "true") {
				showView(recordHandlerNew.getManagedGuiItem());
			}
		}

		function reloadProviders() {
			if (reloadingProvidersInProgress === false) {
				startReloadOfProviders();
			}
		}

		function startReloadOfProviders() {
			setReloadingProvidersInProgressStatus(true);
			metadataProvider.reload(providerReloaded);
			textProvider.reload(providerReloaded);
			recordTypeProvider.reload(providerReloaded);
			searchProvider.reload(providerReloaded);
		}

		function setReloadingProvidersInProgressStatus(status) {
			reloadingProvidersInProgress = status;
			jsClientView.setReloadingProviders(status);
		}

		function providerReloaded() {
			reloadedProviders++;
			if (NO_OF_PROVIDERS === reloadedProviders) {
				reloadedProviders = 0;
				setReloadingProvidersInProgressStatus(false);
				reloadOpenRecords();
			}
		}

		function reloadOpenRecords() {
			managedGuiItemList.forEach(function(managedGuiItem) {
				managedGuiItem.reloadForMetadataChanges();
			});
		}

		function setCurrentLang(lang) {
			textProvider.setCurrentLang(lang);
			reloadOpenRecords();
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		out = Object.freeze({
			"type" : "jsClient",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getView : getView,
			showView : showView,
			getMetadataForRecordTypeId : getMetadataForRecordTypeId,
			afterLogin : afterLogin,
			afterLogout : afterLogout,
			afterRecordTypeProviderReload : afterRecordTypeProviderReload,
			hideAndRemoveView : hideAndRemoveView,
			viewRemoved : viewRemoved,
			addGuiItem : addGuiItem,
			openRecordUsingReadLink : openRecordUsingReadLink,
			reloadProviders : reloadProviders,
			setCurrentLang : setCurrentLang
		});
		start();

		return out;
	};
	return cora;
}(CORA));
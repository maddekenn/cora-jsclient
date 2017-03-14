/*
 * Copyright 2016, 2017 Uppsala University Library
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
	cora.searchRecordHandler = function(dependencies, spec) {
		var self;
		var recordId = getIdFromRecord(spec.recordTypeRecord);

		var viewSpec = {
			// "dependencies" : dependencies,
			"headerText" : recordId,
			"fetchListMethod" : createRecordTypeList
		};
		if (recordTypeHasCreateLink()) {
			viewSpec.createNewMethod = createRecordHandler;
		}

		var searchRecordHandlerView = dependencies.searchRecordHandlerViewFactory.factor(viewSpec);

		function getView() {
			return searchRecordHandlerView.getView();
		}

		function getIdFromRecord(record) {
			var cData = CORA.coraData(record.data);
			var cRecordInfo = CORA.coraData(cData.getFirstChildByNameInData("recordInfo"));
			return cRecordInfo.getFirstAtomicValueByNameInData("id");
		}

		function recordTypeHasCreateLink() {
			var createLink = spec.recordTypeRecord.actionLinks.create;
			if (createLink !== undefined) {
				return true;
			}
			return false;
		}

		function createRecordTypeList() {
			var views = createManagedGuiItem("menuView");
			var listHandlerSpec = {
				"dependencies" : dependencies,
				"createRecordHandlerMethod" : createRecordHandler,
				"recordGuiFactory" : dependencies.recordGuiFactory,
				"recordTypeRecord" : spec.recordTypeRecord,
				"views" : views,
				"baseUrl" : spec.baseUrl,
				"jsClient" : dependencies.jsClient
			};
			dependencies.recordListHandlerFactory.factor(listHandlerSpec);
		}

		function createManagedGuiItem(text) {
			var managedGuiItem = dependencies.jsClient.createManagedGuiItem();
			managedGuiItem.menuView.textContent = text;
			searchRecordHandlerView.addManagedGuiItem(managedGuiItem);
			dependencies.jsClient.showView(managedGuiItem);
			return managedGuiItem;
		}

		function createRecordHandler(presentationMode, record) {
			var text = "New";
			if ("new" !== presentationMode) {
				text = getIdFromRecord(record);
			}
			var views = createManagedGuiItem(text);
			var recordHandlerSpec = {
				"dependencies" : dependencies,
				"recordHandlerViewFactory" : createRecordHandlerViewFactory(),
				"recordTypeRecord" : spec.recordTypeRecord,
				"presentationMode" : presentationMode,
				"record" : record,
				"recordGuiFactory" : dependencies.recordGuiFactory,
				"views" : views,
				"jsClient" : dependencies.jsClient,
				"searchRecordHandler" : self
			};
			dependencies.recordHandlerFactory.factor(recordHandlerSpec);
		}
		function createRecordHandlerViewFactory() {
			return {
				"factor" : function(recordHandlerViewSpec) {
					return CORA.recordHandlerView(recordHandlerViewSpec);
				}
			};
		}

		var out = Object.freeze({
			getView : getView,
			createRecordTypeList : createRecordTypeList,
			createRecordHandlerViewFactory : createRecordHandlerViewFactory,
			createRecordHandler : createRecordHandler
		});
		self = out;
		return out;
	};
	return cora;
}(CORA));
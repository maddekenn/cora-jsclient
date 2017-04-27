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
	cora.recordListHandler = function(dependencies, spec) {
		var managedGuiItem;
		var recordId = spec.recordTypeRecordId;

		function start() {
			managedGuiItem = createManagedGuiItem();
			addToRecordTypeHandler(managedGuiItem);
			showViewInClient(managedGuiItem);

			addTextToMenuView();
			fetchDataFromServer(processFetchedRecords);
		}

		function createManagedGuiItem() {
			var managedGuiItemSpec = {
				"activateMethod" : spec.jsClient.showView,
				"removeMethod" : spec.jsClient.viewRemoved
			};
			return dependencies.managedGuiItemFactory.factor(managedGuiItemSpec);
		}

		function addToRecordTypeHandler(managedGuiItemToAdd) {
			spec.addToRecordTypeHandlerMethod(managedGuiItemToAdd);
		}

		function showViewInClient(managedGuiItemToShow) {
			spec.jsClient.showView(managedGuiItemToShow);
		}

		function addTextToMenuView() {
			var menuPresentation = CORA.gui.createSpanWithClassName("");
			menuPresentation.textContent = "List";
			managedGuiItem.addMenuPresentation(menuPresentation);
		}

		function fetchDataFromServer(callAfterAnswer) {
			var listLink = spec.listLink;
			var callSpec = {
				"requestMethod" : listLink.requestMethod,
				"url" : listLink.url,
				"contentType" : listLink.contentType,
				"accept" : listLink.accept,
				"loadMethod" : callAfterAnswer,
				"errorMethod" : callError
			};
			dependencies.ajaxCallFactory.factor(callSpec);
		}

		function processFetchedRecords(answer) {
			createRecordTypeListFromAnswer(answer);
		}

		function createRecordTypeListFromAnswer(answer) {
			var data = JSON.parse(answer.responseText).dataList.data;
			data.forEach(function(recordContainer) {
				tryToAddRecordToWorkView(recordContainer);
			});
		}

		function tryToAddRecordToWorkView(recordContainer) {
			try {
				addRecordToWorkView(recordContainer.record);
			} catch (e) {
				managedGuiItem.addWorkPresentation(document.createTextNode(e));
				managedGuiItem.addWorkPresentation(document.createTextNode(e.stack));
			}
		}

		function addRecordToWorkView(record) {
			var view = createView(record);
			managedGuiItem.addWorkPresentation(view);

			var recordTypeId = getRecordTypeIdFromRecord(record);
			var metadataId = spec.jsClient.getMetadataForRecordTypeId(recordTypeId).metadataId;
			// var listPresentationId =
			// spec.jsClient.getMetadataForRecordTypeId(recordTypeId).listPresentationId;
			var presentationId = spec.listPresentationViewId;
			var dataDivider = getDataDividerFromData(record.data);
			var recordGuiSpec = {
				"metadataId" : metadataId,
				"data" : record.data,
				"dataDivider" : dataDivider
			};
			var recordGui = dependencies.recordGuiFactory.factor(recordGuiSpec);
			var presentationView = recordGui.getPresentationHolder(presentationId, metadataId)
					.getView();
			recordGui.initMetadataControllerStartingGui();

			view.appendChild(presentationView);
		}

		function getRecordTypeIdFromRecord(record) {
			var cData = CORA.coraData(record.data);
			var cRecordInfo = CORA.coraData(cData.getFirstChildByNameInData("recordInfo"));
			return cRecordInfo.getFirstAtomicValueByNameInData("type");
		}

		function createView(record) {
			var newView = CORA.gui.createSpanWithClassName("listItem " + recordId);
			newView.onclick = function(event) {
				var loadInBackground = "false";
				if (event.ctrlKey) {
					loadInBackground = "true";
				}
				spec.openRecordMethod("view", record, loadInBackground);
			};
			return newView;
		}

		function getDataDividerFromData(data) {
			var cData = CORA.coraData(data);
			var cRecordInfo = CORA.coraData(cData.getFirstChildByNameInData("recordInfo"));
			var cDataDivider = CORA.coraData(cRecordInfo.getFirstChildByNameInData("dataDivider"));
			return cDataDivider.getFirstAtomicValueByNameInData("linkedRecordId");
		}

		function callError(answer) {
			var messageHolder = CORA.messageHolder();
			managedGuiItem.addWorkPresentation(messageHolder.getView());
			var messageSpec = {
				"message" : answer.status,
				"type" : CORA.message.ERROR
			};
			messageHolder.createMessage(messageSpec);
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}
		var out = Object.freeze({
			"type" : "recordListHandler",
			getDependencies : getDependencies,
			getSpec : getSpec,
			open : open,
			processFetchedRecords : processFetchedRecords
		});

		start();

		return out;
	};
	return cora;
}(CORA));
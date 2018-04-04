/*
 * Copyright 2017, 2018 Uppsala University Library
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
	cora.resultHandler = function(dependencies, spec) {
		var out;
		var view;
		var showIndexButton = false;

		function start() {
			view = createView();
			possiblyAddFilterPresentation();
			createAndAddPresentationsForEachResultItem();
			possiblyAddIndexButton();
		}

		function createView() {
			var viewSpec = {
				"ofText" : dependencies.textProvider
						.getTranslation("theClient_resultListOfText"),
				"fromNo" : spec.dataList.fromNo,
				"toNo" : spec.dataList.toNo,
				"totalNo" : spec.dataList.totalNo,
				"resultHandler" : out
			};
			return dependencies.resultHandlerViewFactory.factor(viewSpec);
		}
		
		function possiblyAddFilterPresentation(){
			if(resultHasFilter()){
				addFilterPresentation();
			}
		}
		
		function resultHasFilter(){
			return dependencies.presentationFactory !== undefined 
					&& spec.filterPresentationId !== undefined;
		}
		
		function addFilterPresentation(){
			var filterPresentationSpec = {
					"path" : {},
					"metadataIdUsedInData" : spec.filterMetadataId,
					"cPresentation" : spec.filterPresentationId
				}
				var presentation = dependencies.presentationFactory.factor(filterPresentationSpec);
				view.addChildPresentation(presentation.getView());
		}

		function createAndAddPresentationsForEachResultItem() {
			var data = spec.dataList.data;
			data.forEach(tryToAddResultItemToView);
		}

		function tryToAddResultItemToView(recordContainer) {
			addResultItemToWorkView(recordContainer.record);
		}

		function addResultItemToWorkView(result) {
			if(result.actionLinks.index !== undefined){
				showIndexButton = true;
			}
			var recordHandlerSpec = {
				"fetchLatestDataFromServer" : "false",
				"partOfList" : "true",
				"createNewRecord" : "false",
				"record" : result,
				"jsClient" : dependencies.jsClient
			};
			var recordHandlerNew = dependencies.recordHandlerFactory
					.factor(recordHandlerSpec);
			view.addChildPresentation(recordHandlerNew.getManagedGuiItem()
					.getListView(), result);
		}

		function openRecord(openInfo) {
			if (spec.triggerWhenResultIsChoosen !== undefined) {
				spec.triggerWhenResultIsChoosen(openInfo);
			} else {
				openRecordUsingJsClient(openInfo);
			}
		}

		function openRecordUsingJsClient(openInfoIn) {
			var openInfo = {
				"readLink" : openInfoIn.record.actionLinks.read,
				"loadInBackground" : openInfoIn.loadInBackground
			};
			dependencies.jsClient.openRecordUsingReadLink(openInfo);
		}

		function possiblyAddIndexButton(){
			if(showIndexButton) {
				view.addButton("INDEX", indexDataList, "indexButton");
			}
		}

		function indexDataList() {
			var indexListSpec = {
				"dataList" : spec.dataList
			};
			var indexListHandler = dependencies.indexListHandlerFactory
					.factor(indexListSpec);
			indexListHandler.indexDataList();
		}

		function getDependencies() {
			return dependencies;
		}
		function getView() {
			return view.getView();
		}

		function getSpec() {
			return spec;
		}

		out = Object.freeze({
			"type" : "resultHandler",
			getView : getView,
			getDependencies : getDependencies,
			getSpec : getSpec,
			openRecord : openRecord,
			indexDataList : indexDataList
		});
		start();
		return out;
	};
	return cora;
}(CORA));
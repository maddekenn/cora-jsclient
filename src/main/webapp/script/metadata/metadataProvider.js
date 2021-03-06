/*
 * Copyright 2016, 2017 Olov McKie
 * Copyright 2016, 2018 Uppsala University Library
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
	cora.metadataProvider = function(dependencies, spec) {
		var textProvider = dependencies.textProvider;
		var processedAjaxCalls = 0;
		var metadata = {};
		var NUMBER_OF_AJAX_CALLS = 2;
		function start() {
			fetchMetadataListAndThen(processFetchedMetadata);
			fetchPresentationListAndThen(processFetchedMetadata);
			fetchGuiElementListAndThen(processFetchedMetadata);
		}

		function fetchMetadataListAndThen(callAfterAnswer) {
			callThroughAjax(spec.metadataListLink, callAfterAnswer);
		}

		function callThroughAjax(linkSpec, callAfterAnswer) {
			var ajaxCallSpec = createIndependentCopy(linkSpec);
			ajaxCallSpec.loadMethod = callAfterAnswer;
			dependencies.ajaxCallFactory.factor(ajaxCallSpec);
		}

		function createIndependentCopy(someObject) {
			return JSON.parse(JSON.stringify(someObject));
		}

		function processFetchedMetadata(answer) {
			createMetadataObjectFromAnswer(answer);
			processedAjaxCalls++;
			possiblyCallWhenReady();
		}

		function possiblyCallWhenReady() {
			if (spec.callWhenReady && processedAjaxCalls === NUMBER_OF_AJAX_CALLS) {
				spec.callWhenReady();
			}
		}

		function createMetadataObjectFromAnswer(answer) {
			var data = JSON.parse(answer.responseText).dataList.data;
			data.forEach(function(recordContainer) {
				var recordData = recordContainer.record.data;
				var recordId = getIdFromRecordData(recordData);
				metadata[recordId] = recordData;
			});
		}

		function getIdFromRecordData(recordData) {
			var cRecord = CORA.coraData(recordData);
			var cRecordInfo = CORA.coraData(cRecord.getFirstChildByNameInData("recordInfo"));
			var id = cRecordInfo.getFirstAtomicValueByNameInData("id");
			return id;
		}

		function fetchPresentationListAndThen(callAfterAnswer) {
			callThroughAjax(spec.presentationListLink, callAfterAnswer);
		}

		function fetchGuiElementListAndThen(callAfterAnswer) {
			callThroughAjax(spec.guiElementListLink, callAfterAnswer);
		}

		function getMetadataById(metadataId) {
			if (metadata[metadataId] !== undefined) {
				return metadata[metadataId];
			}
			return tryToGetMetadataFromTextProvider(metadataId);
		}

		function tryToGetMetadataFromTextProvider(metadataId) {
			try {
				return textProvider.getMetadataById(metadataId);
			} catch (error) {
				throw new Error("Id(" + metadataId + ") not found in metadataProvider");
			}
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		var out = Object.freeze({
			"type" : "metadataProvider",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getMetadataById : getMetadataById,
			processFetchedMetadata : processFetchedMetadata
		});
		start();
		return out;
	};
	return cora;
}(CORA));
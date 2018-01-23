/*
 * Copyright 2018 Uppsala University Library
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
	cora.indexListHandler = function(dependencies, spec) {
		var listOfDataToIndex;
		var uploading = false;
		var uploadQue = [];
		function start() {
			listOfDataToIndex = spec.dataList.data;
		}

		function indexDataList(){
			listOfDataToIndex.forEach(indexData);
		}
		
		function indexData(dataRecord) {
			var record = dataRecord.record;
			var indexLink = record.actionLinks.index;

			var callSpec = {
				"url" : indexLink.url,
				"requestMethod" : indexLink.requestMethod,
				"accept" : indexLink.accept,
				"contentType" : indexLink.contentType,
				"data" : JSON.stringify(indexLink.body),
				"loadMethod" : uploadFinished,
				"errorMethod" : handleCallError
			};
			uploadQue.push(callSpec);
			possiblyStartNextUpload();
			//dependencies.ajaxCallFactory.factor(callSpec);
		}

		function uploadFinished() {
			uploading = false;
			//view.deactivate();
			possiblyStartNextUpload();
		}

		function possiblyStartNextUpload() {
			if (getCurrentlyNotUploading()) {
				startNextUploadIfThereIsMoreInQueue();
			}
		}

		function getCurrentlyNotUploading() {
			return uploading !== true;
		}

		function startNextUploadIfThereIsMoreInQueue() {
			var callSpec = uploadQue.shift();
			if (callSpec !== undefined) {
				startNextUpload(callSpec);
			}
		}

		function startNextUpload(callSpec) {
			uploading = true;
			//view.activate();
			dependencies.ajaxCallFactory.factor(callSpec);
		}

		function handleCallError(error) {
			throw new Error("error indexing", error);
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		var out = Object.freeze({
			"type" : "indexListHandler",
			getDependencies : getDependencies,
			getSpec : getSpec,
			indexData : indexData,
			indexDataList : indexDataList,
			uploadFinished : uploadFinished,
			handleCallError : handleCallError
		});

		start();

		return out;
	};
	return cora;
}(CORA));
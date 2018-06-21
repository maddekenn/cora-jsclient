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
	cora.listWithFilterHandler = function(dependencies, spec) {
		var searchId = getIdFromRecord(spec.searchRecord);

		var viewSpec = {
			"headerText" : searchId,
			"openSearchMethod" : openSearch
		};

		var view = dependencies.searchRecordHandlerViewFactory.factor(viewSpec);

		function getIdFromRecord(record) {
			var cData = CORA.coraData(record.data);
			var cRecordInfo = CORA.coraData(cData.getFirstChildByNameInData("recordInfo"));
			return cRecordInfo.getFirstAtomicValueByNameInData("id");
		}

		function getView() {
			return view.getView();
		}

		function openSearch() {
			var searchHandlerSpec = {
				"metadataId" : getLinkValueFromSearchRecord("metadataId"),
				"presentationId" : getLinkValueFromSearchRecord("presentationId")
			};
			addSearchLinkToSpec(searchHandlerSpec);
			dependencies.searchHandlerJSClientIntegratorFactory.factor(searchHandlerSpec);
		}

		function getLinkValueFromSearchRecord(id) {
			var cSearchRecordData = CORA.coraData(spec.searchRecord.data);
			var cRecordLink = CORA.coraData(cSearchRecordData.getFirstChildByNameInData(id));
			return cRecordLink.getFirstAtomicValueByNameInData("linkedRecordId");
		}

		function addSearchLinkToSpec(searchHandlerSpec) {
			searchHandlerSpec.searchLink = spec.searchRecord.actionLinks.search;
		}

		function addManagedGuiItem(managedGuiItem) {
			view.addManagedGuiItem(managedGuiItem);
		}

		function getSpec() {
			return spec;
		}

		function getDependencies() {
			return dependencies;
		}

		var out = Object.freeze({
			"type" : "listWithFilterHandler",
			getSpec : getSpec,
			getDependencies : getDependencies,
			getView : getView,
			openSearch : openSearch,
			addManagedGuiItem : addManagedGuiItem
		});
		return out;
	};
	return cora;
}(CORA));
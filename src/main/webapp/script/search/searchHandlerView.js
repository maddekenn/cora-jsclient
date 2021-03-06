/*
 * Copyright 2017, 2019 Uppsala University Library
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
	cora.searchHandlerView = function(dependencies, spec) {
		var view;
		var searchFormHolder;
		var buttonView;
		var resultHolder;

		function start() {
			var workItemView = createWorkItemView();
			view = workItemView.getView();
			createSearchFormHolderAndAddTo(workItemView);
			createButtonViewAndAddTo(searchFormHolder);
			createSearchButtonIn(buttonView);
			createResultHolderAndAddTo(workItemView);
		}

		function createWorkItemView() {
			var workItemViewSpec = {
				"extraClassName" : "search"
			};
			return dependencies.workItemViewFactory.factor(workItemViewSpec);
		}

		function createSearchFormHolderAndAddTo(addTo) {
			searchFormHolder = CORA.gui.createSpanWithClassName("searchFormHolder");
			addTo.addViewToView(searchFormHolder);
		}

		function createButtonViewAndAddTo(addTo) {
			buttonView = CORA.gui.createSpanWithClassName("buttonView");
			addTo.appendChild(buttonView);
		}

		function createSearchButtonIn(buttonViewToAddTo) {
			var searchButton = createButton();
			buttonViewToAddTo.appendChild(searchButton);
		}

		function createButton() {
			var buttonSpec = {
					type : "input",
					className : "searchButton",
					text : dependencies.textProvider.getTranslation("theClient_searchButtonText"),
					action : {
						method : spec.searchMethod
					}
			};
			return CORA.gui.inputButton(buttonSpec);
		}

		function createResultHolderAndAddTo(addTo) {
			resultHolder = CORA.gui.createSpanWithClassName("searchResultHolder");
			addTo.addViewToView(resultHolder);
		}

		function getView() {
			return view;
		}

		function addPresentationToSearchFormHolder(presentationToAdd) {
			searchFormHolder.insertBefore(presentationToAdd, searchFormHolder.lastChild);
		}

		function addSearchResultToSearchResultHolder(resultToAdd) {
			resultHolder.appendChild(resultToAdd);
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		function clearResultHolder(){
			 resultHolder.innerHTML = "";
		}

		start();
		return Object.freeze({
			"type" : "searchHandlerView",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getView : getView,
			addPresentationToSearchFormHolder : addPresentationToSearchFormHolder,
			addSearchResultToSearchResultHolder : addSearchResultToSearchResultHolder,
			clearResultHolder : clearResultHolder
		});
	};
	return cora;
}(CORA));
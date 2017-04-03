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
	cora.managedGuiItem = function(dependencies, spec) {
		var viewSpec = {
			"activateMethod" : spec.activateMethod,
			"removeMenuMethod" : spec.removeMenuMethod,
			"removeWorkMethod" : spec.removeWorkMethod
		};
		var managedGuiItemView = dependencies.managedGuiItemViewFactory
				.factor(viewSpec);
		if (spec.menuPresentation !== undefined) {
			managedGuiItemView.addMenuPresentation(spec.menuPresentation);
		}
		if (spec.workPresentation !== undefined) {
			managedGuiItemView.addWorkPresentation(spec.workPresentation);
		}

		var menuView = getMenuView();
		var workView = getWorkView();

		var active = false;
		var changed = false;

		function getMenuView() {
			return managedGuiItemView.getMenuView();
		}

		function getWorkView() {
			return managedGuiItemView.getWorkView();
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		function handleBy(someThing) {
			spec.handleBy(someThing);
		}

		function addMenuPresentation(presentationToAdd) {
			managedGuiItemView.addMenuPresentation(presentationToAdd);
		}

		function addWorkPresentation(presentationToAdd) {
			managedGuiItemView.addWorkPresentation(presentationToAdd);
		}
		function setChanged(changedIn) {
			changed = changedIn;
			updateViewState();
		}

		function updateViewState() {
			var state = {
				"active" : active,
				"changed" : changed
			};
			managedGuiItemView.updateMenuView(state);
		}
		function setActive(activeIn) {
			active = activeIn;
			updateViewState();
		}

		function clearMenuView() {
			managedGuiItemView.clearMenuView();
		}

		function clearWorkView() {
			managedGuiItemView.clearWorkView();
		}

		var out = Object.freeze({
			"type" : "managedGuiItem",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getMenuView : getMenuView,
			getWorkView : getWorkView,
			handleBy : handleBy,
			addMenuPresentation : addMenuPresentation,
			addWorkPresentation : addWorkPresentation,
			setChanged : setChanged,
			setActive : setActive,
			clearMenuView : clearMenuView,
			clearWorkView : clearWorkView
		});

		return out;
	};

	return cora;
}(CORA));
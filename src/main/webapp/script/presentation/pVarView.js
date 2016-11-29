/*
 * Copyright 2016 Olov McKie
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
	cora.pVarView = function(dependencies, spec) {
		var out;
		var view;
		var valueView;

		function start() {
			view = CORA.gui.createSpanWithClassName("pVar " + spec.presentationId);
			var info = createInfo();

			createValueView();
			view.appendChild(valueView);
		}
		function createInfo() {
			var infoSpec = {
				"appendTo" : view,
				// "afterLevelChange" : updateView,
				"level1" : [ {
					"className" : "textView",
					"text" : spec.info.text
				}, {
					"className" : "defTextView",
					"text" : spec.info.defText
				} ],
			};
			if (spec.info.technicalInfo) {
				infoSpec.level2 = [];

				spec.info.technicalInfo.forEach(function(text) {

					infoSpec.level2.push({
						"className" : "technicalView",
						"text" : text
					});
				});
			}
			return dependencies.infoFactory.factor(infoSpec);
		}
		// function updateView() {
		// var className = originalClassName;
		// if (state === "error") {
		// className += " error";
		// }
		// if (info.getInfoLevel() !== 0) {
		// className += " infoActive";
		// }
		// view.className = className;
		// }

		function createValueView() {
			if (spec.mode === "input") {
				valueView = createInput();
			} else {
				valueView = createOutput();
			}
		}

		function createInput() {
			valueView = createTextTypeInput();
			if (spec.onblurFunction !== undefined) {
				valueView.onblur = function() {
					spec.onblurFunction(valueView.value);
				}
			}
			return valueView;
		}

		function createTextTypeInput() {
			var inputNew = document.createElement("input");
			inputNew.type = "text";
			inputNew.setValue = function(value) {
				inputNew.value = value;
			}
			return inputNew;
		}

		function createOutput() {
			if (spec.outputFormat === "image") {
				return createOutputImage();
			}
			return createOutputText();
		}

		function createOutputImage() {
			var outputNew = document.createElement("img");
			outputNew.setValue = function(value) {
				outputNew.src = value;
			}
			return outputNew;
		}

		function createOutputText() {
			var outputNew = document.createElement("span");
			outputNew.setValue = function(value) {
				outputNew.textContent = value;
			}
			return outputNew;
		}

		function getView() {
			return view;
		}

		function getDependencies() {
			return dependencies;
		}

		function getSpec() {
			return spec;
		}

		function setValue(value) {
			valueView.setValue(value);
		}

		out = Object.freeze({
			"type" : "pVarView",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getView : getView,
			setValue : setValue
		});
		start();
		return out;
	};
	return cora;
}(CORA));
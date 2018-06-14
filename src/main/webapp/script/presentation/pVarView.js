/*
 * Copyright 2016, 2018 Olov McKie
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
		var baseClassName = "pVar " + spec.presentationId;
		var info;
		var state = "ok";

		function start() {
			view = CORA.gui.createSpanWithClassName(baseClassName);
			info = createInfo();

			createValueView();
			view.appendChild(valueView);
			view.appendChild(info.getButton());
		}
		function createInfo() {
			var infoSpec = {
				"appendTo" : view,
				"afterLevelChange" : updateClassName,
				"level1" : [ {
					"className" : "textView",
					"text" : spec.info.text
				}, {
					"className" : "defTextView",
					"text" : spec.info.defText
				} ]
			};
			possiblyAddLevel2Info(infoSpec);
			return dependencies.infoFactory.factor(infoSpec);
		}
		function possiblyAddLevel2Info(infoSpec) {
			if (specInfoHasTechnicalInfo()) {
				addLevelTechnicalInfoAsLevel2(infoSpec);
			}
		}

		function specInfoHasTechnicalInfo() {
			return spec.info.technicalInfo;
		}

		function addLevelTechnicalInfoAsLevel2(infoSpec) {
			infoSpec.level2 = [];
			spec.info.technicalInfo.forEach(function(techInfo) {
				infoSpec.level2.push(createTechInfoPart(techInfo));
			});
		}

		function createTechInfoPart(techInfo) {
			var techInfoPart = {
				"className" : "technicalView",
				"text" : techInfo.text
			};

			if (techInfo.onclickMethod !== undefined) {
				techInfoPart.onclickMethod = techInfo.onclickMethod;
			}
			return techInfoPart;
		}

		function updateClassName() {
			var className = baseClassName;
			if (stateIndicatesError()) {
				className += " error";
			}
			if (stateIndicatesErrorStillFocused()) {
				className += " errorStillFocused";
			}
			if (infoIsShown()) {
				className += " infoActive";
			}
			view.className = className;
		}

		function stateIndicatesError() {
			return state === "error";
		}
		function stateIndicatesErrorStillFocused() {
			return state === "errorStillFocused";
		}

		function infoIsShown() {
			return info.getInfoLevel() !== 0;
		}

		function createValueView() {
			if (spec.mode === "input") {
				valueView = createInput();
			} else {
				valueView = createOutput();
			}
		}

		function createInput() {
			valueView = createTextTypeInput();
			possiblyAddOnkeyupEvent(valueView);
			possiblyAddOnblurEvent(valueView);
			possiblyAddPlaceholderText(valueView);
			return valueView;
		}

		function possiblyAddOnkeyupEvent(valueViewIn) {
			if (spec.onkeyupFunction !== undefined) {
				valueViewIn.onkeyup = function() {
					spec.onkeyupFunction(valueViewIn.value);
				};
			}
		}

		function possiblyAddOnblurEvent(valueViewIn) {
			if (spec.onblurFunction !== undefined) {
				valueViewIn.onblur = function() {
					spec.onblurFunction(valueViewIn.value);
				};
			}
		}

		function possiblyAddPlaceholderText(inputNew) {
			if (spec.placeholderText !== undefined) {
				inputNew.placeholder = spec.placeholderText;
			}
		}

		function createTextTypeInput() {
			var inputNew = document.createElement(getInputTypeFromSpec());
			inputNew.setValue = function(value) {
				inputNew.value = value;
			};
			return inputNew;
		}

		function getInputTypeFromSpec() {
			if (spec.inputType !== undefined) {
				return spec.inputType;
			}
			return "input";
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
			};
			return outputNew;
		}

		function createOutputText() {
			var outputNew = document.createElement("span");
			outputNew.setValue = function(value) {
				outputNew.textContent = value;
			};
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

		function setState(stateIn) {
			state = stateIn;
			updateClassName();
		}

		out = Object.freeze({
			"type" : "pVarView",
			getDependencies : getDependencies,
			getSpec : getSpec,
			getView : getView,
			setValue : setValue,
			updateClassName : updateClassName,
			setState : setState
		});
		start();
		return out;
	};
	return cora;
}(CORA));
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
	cora.question = function(spec) {
		var view = createView();
		var hideIfTransitionendNotCalled;

		var questionBox = createTextView();
		view.appendChild(questionBox);

		createAndAddButtons();

		function createView() {
			return CORA.gui.createDivWithClassName("question");
		}
		function createTextView() {
			var viewNew = CORA.gui.createDivWithClassName("questionBox");
			var textElement = document.createElement("text");
			viewNew.appendChild(textElement);
			textElement.innerHTML = spec.text;
			return viewNew;
		}

		function createAndAddButtons() {
			spec.buttons.forEach(function(buttonSpec) {
				var button = addButton(buttonSpec);
				questionBox.appendChild(button);
			});
		}

		function addButton(buttonSpec) {
			// var button = document.createElement("input");
			// button.type = "button";
			// button.value = buttonSpec.text;
			// if (buttonSpec.onclickFunction) {
			// button.onclick = function() {
			// buttonSpec.onclickFunction();
			// hideWithEffect();
			// };
			// } else {
			// button.onclick = function() {
			// hideWithEffect();
			// };
			// }
			// return button;
			var buttonSpec2 = {
				// "className" : className,
				"text" : buttonSpec.text,
			};

			if (buttonSpec.onclickFunction) {
				buttonSpec2.action = {
					method : function() {
						buttonSpec.onclickFunction();
						hideWithEffect();
					}
				};
			} else {
				buttonSpec2.action = {
					method : hideWithEffect
				};
			}
			return CORA.gui.inputButton(buttonSpec2);
		}

		function getView() {
			return view;
		}

		function hide() {
			clearHideTimeout();
			view.className = view.className + " hidden";
			view.parentNode.removeChild(view);
		}

		function clearHideTimeout() {
			if (hideIfTransitionendNotCalled) {
				window.clearTimeout(hideIfTransitionendNotCalled);
			}
		}

		function hideWithEffect() {
			hideIfTransitionendNotCalled = window.setTimeout(function() {
				view.modelObject.hide();
			}, 1000);
			view.addEventListener("transitionend", function() {
				view.modelObject.hide();
			}, true);
			view.className = view.className + " toBeRemoved";
		}

		var out = Object.freeze({
			getView : getView,
			hide : hide,
			hideWithEffect : hideWithEffect
		});
		view.modelObject = out;
		return out;
	};

	return cora;
}(CORA));
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
	cora.holder = function(spec) {
		var status;
		var button = createButton();
		var view = createBaseView();
		close();
		addBaseViewAccordingToSpec();

		function createButton() {
			var className = "iconButton";
			className += getClassNameFromSpec();
			var holderButtonSpec = {
				"className" : className,
				"onclick" : toggleHolder
			};
			return CORA.gui.createButton(holderButtonSpec);
		}

		function getClassNameFromSpec() {
			if (spec.className !== undefined) {
				return " " + spec.className;
			}
			return "";
		}

		function toggleHolder(event) {
			if (status === cora.holder.OPEN) {
				close();
			} else {
				open();
			}
			if (spec.afterOpenClose !== undefined) {
				spec.afterOpenClose(event);
			}
		}
		function open() {
			status = cora.holder.OPEN;
			view.style.display = view.previousDisplay;
		}
		function close() {
			status = cora.holder.CLOSED;
			view.previousDisplay = view.style.display;
			view.style.display = "none";
		}

		function createBaseView() {
			return CORA.gui.createSpanWithClassName("holder"+getClassNameFromSpec());
		}

		function addBaseViewAccordingToSpec() {
			if (spec.appendTo !== undefined) {
				spec.appendTo.appendChild(view);
			}
			if (spec.insertAfter !== undefined) {
				spec.insertAfter.parentNode.insertBefore(view, spec.insertAfter.nextSibling);
			}
		}
		function getButton() {
			return button;
		}

		function getView() {
			return view;
		}

		function getStatus() {
			return status;
		}

		var out = Object.freeze({
			getButton : getButton,
			toggleHolder : toggleHolder,
			getView : getView,
			getStatus : getStatus
		});
		return out;
	};
	cora.holder.CLOSED = 0;
	cora.holder.OPEN = 1;
	return cora;
}(CORA));
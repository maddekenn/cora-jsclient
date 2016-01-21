/*
 * Copyright 2016 Uppsala University Library
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
	cora.Variable = function(newPath, metadataId, mode, metadataProvider, pubSub) {
		var view = createBaseView();
		var htmlTag = createHtmlTag(this, mode);
		view.appendChild(htmlTag);
		pubSub.subscribe("setValue", newPath, this, handleMsg);

		function createBaseView() {
			var view = document.createElement("span");
			return view;
		}
		function createHtmlTag(variableFunction, viewMode) {
			if (viewMode === "input") {
				return createInput(variableFunction);
			}
			return createOutput(variableFunction);
		}

		function createInput(variableFunction) {
			var inputNew = document.createElement("input");
			inputNew.type = "text";
			inputNew.modelObject = variableFunction;
			return inputNew;
		}
		function createOutput(variableFunction) {
			var outputNew = document.createElement("span");
			outputNew.modelObject = variableFunction;
			return outputNew;
		}

		this.getView = function() {
			return view;
		};

		this.setValue = function(value) {
			if(mode==="input"){
				htmlTag.value = value;
			}else{
				htmlTag.textContent = value;
			}
		};
		function handleMsg(dataFromMsg, msg){
			this.setValue(dataFromMsg.data);
		}
	};
	return cora;
}(CORA || {}));
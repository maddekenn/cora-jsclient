/*
 * Copyright 2016, 2018 Uppsala University Library
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
	cora.pRepeatingContainer = function(dependencies, spec) {
		var path = spec.path;
		var cPresentation = spec.cPresentation;
		var metadataProvider = dependencies.metadataProvider;
		var textProvider = dependencies.textProvider;
		var presentationFactory = dependencies.presentationFactory;

		var recordInfo = cPresentation.getFirstChildByNameInData("recordInfo");

		var presentationId = CORA.coraData(recordInfo).getFirstAtomicValueByNameInData("id");
		var view = createBaseView();

		function createBaseView() {
			var viewNew = CORA.gui.createSpanWithClassName("pRepeatingContainer " + presentationId);

			var presentationChildren = cPresentation.getFirstChildByNameInData("childReferences").children;

			presentationChildren.forEach(function(presentationChildRef) {
				viewNew.appendChild(createViewForChild(presentationChildRef));
			});

			return viewNew;
		}
		function createViewForChild(presentationChildRef) {
			var refId = getRefId(presentationChildRef);
			var cPresentationChild = getMetadataById(refId);
			if (cPresentationChild.getData().name === "text") {
				var text = CORA.gui.createSpanWithClassName("text");
				text.appendChild(document.createTextNode(textProvider.getTranslation(refId)));
				return text;
			}
			var presentationSpec = {
				"path" : path,
				"metadataIdUsedInData" : spec.metadataIdUsedInData,
				"cPresentation" : cPresentationChild
			};
			var presentation = presentationFactory.factor(presentationSpec);
			return presentation.getView();
		}

		function getRefId(presentationChildRef) {
			var cPresentationChildRef = CORA.coraData(presentationChildRef);
			var cRefGroup = CORA.coraData(cPresentationChildRef
					.getFirstChildByNameInData("refGroup"));
			var cRef = CORA.coraData(cRefGroup.getFirstChildByNameInData("ref"));
			return cRef.getFirstAtomicValueByNameInData("linkedRecordId");
		}

		function getMetadataById(id) {
			return CORA.coraData(metadataProvider.getMetadataById(id));
		}

		function getView() {
			return view;
		}

		var out = Object.freeze({
			"type" : "pRepeatingContainer",
			getView : getView
		});
		view.modelObject = out;
		return out;
	};
	return cora;
}(CORA));
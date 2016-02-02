/*
 * Copyright 2016 Uppsala University Library
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
"use strict";
var CORATEST = (function(coraTest) {
	"use strict";
	coraTest.attachedPSurroundingContainerFactory = function(metadataProvider, pubSub, textProvider,
			presentationFactory, jsBookkeeper, fixture) {
		var factor = function(path, pSurroundingContainerId) {
			var cPSurroundingContainer = CORA.coraData(metadataProvider
					.getMetadataById(pSurroundingContainerId));
			var spec = {
				"path" : path,
				"cPresentation" : cPSurroundingContainer,
				"metadataProvider" : metadataProvider,
				"pubSub" : pubSub,
				"textProvider" : textProvider,
				"presentationFactory" : presentationFactory,
				"jsBookkeeper" : jsBookkeeper

			};
			var pSurroundingContainer = CORA.pSurroundingContainer(spec);
			var view = pSurroundingContainer.getView();
			fixture.appendChild(view);
			var valueView = view.firstChild;
			return {
				pSurroundingContainer : pSurroundingContainer,
				fixture : fixture,
				valueView : valueView,
				metadataProvider : metadataProvider,
				pubSub : pubSub,
				textProvider : textProvider,
				jsBookkeeper : jsBookkeeper,
				view : view
			};

		};
		return Object.freeze({
			factor : factor
		});
	};

	return coraTest;
}(CORATEST || {}));

QUnit.module("CORA.pSurroundingContainer", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.metadataProvider = new MetadataProviderStub();
		this.pubSub = new PubSubSpy();
		this.textProvider = CORATEST.textProviderStub();
		this.jsBookkeeper = CORATEST.jsBookkeeperSpy();
		this.presentationFactory = CORATEST.presentationFactorySpy();
		this.pSurroundingContainerFactory = CORATEST.attachedPSurroundingContainerFactory(
				this.metadataProvider, this.pubSub, this.textProvider, this.presentationFactory,
				this.jsBookkeeper, this.fixture);
	},
	afterEach : function() {
	}
});

QUnit.test("testInit",
		function(assert) {
			var attachedPSurroundingContainer = this.pSurroundingContainerFactory.factor({},
					"pTextVariableIdRContainer");
			assert.strictEqual(attachedPSurroundingContainer.pSurroundingContainer.type,
					"pSurroundingContainer");
			assert.deepEqual(attachedPSurroundingContainer.view.className, "pSurroundingContainer "
					+ "pTextVariableIdRContainer");
			var view = attachedPSurroundingContainer.view;
			assert.ok(view.modelObject === attachedPSurroundingContainer.pSurroundingContainer,
					"modelObject should be a pointer to the javascript object instance");
			assert.strictEqual(view.childNodes.length, 3);

			assert.strictEqual(view.childNodes[0].textContent, "En rubrik");

			var cPresentation = this.presentationFactory.getCPresentation();
			var recordInfo = cPresentation.getFirstChildByNameInData("recordInfo");

			var presentationId = CORA.coraData(recordInfo).getFirstAtomicValueByNameInData("id");
			assert.strictEqual(presentationId, "pVarTextVariableId");
		});

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
"use strict";
var CORATEST = (function(coraTest) {
	"use strict";
	coraTest.attachedPRepeatingElementFactory = function(jsBookkeeper, fixture) {
		var factor = function(repeatMin, repeatMax, path) {
			var spec = {
				"repeatMin" : repeatMin,
				"repeatMax" : repeatMax,
				"path" : path,
				"jsBookkeeper" : jsBookkeeper
			};
			var pRepeatingElement = CORA.pRepeatingElement(spec);
			var view = pRepeatingElement.getView();
			fixture.appendChild(view);
			return {
				pRepeatingElement : pRepeatingElement,
				fixture : fixture,
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

QUnit.module("CORA.pRepeatingElement", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.jsBookkeeper = CORATEST.jsBookkeeperSpy();

		this.pRepeatingElementFactory = CORATEST.attachedPRepeatingElementFactory(
				this.jsBookkeeper, this.fixture);
	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var repeatMin = "1";
	var repeatMax = "2";
	var path = {};
	var attachedPRepeatingElement = this.pRepeatingElementFactory
			.factor(repeatMin, repeatMax, path);
	var pRepeatingElement = attachedPRepeatingElement.pRepeatingElement;
	assert.strictEqual(pRepeatingElement.type, "pRepeatingElement");
	assert.deepEqual(attachedPRepeatingElement.view.className, "repeatingElement");
	var view = attachedPRepeatingElement.view;
	assert.ok(view.modelObject === pRepeatingElement,
			"modelObject should be a pointer to the javascript object instance");

	// remove button
	var repeatingElement = view;
	assert.strictEqual(repeatingElement.className, "repeatingElement");
	var buttonView = repeatingElement.childNodes[0];
	assert.strictEqual(buttonView.className, "buttonView");
	var removeButton = buttonView.firstChild;
	assert.strictEqual(removeButton.className, "removeButton");
});

QUnit.test("testButtonViewAndRemoveButton", function(assert) {
	var repeatMin = "1";
	var repeatMax = "2";
	var path = {};
	var attachedPRepeatingElement = this.pRepeatingElementFactory
			.factor(repeatMin, repeatMax, path);
	var view = attachedPRepeatingElement.view;

	var repeatingElement = view;
	var buttonView = repeatingElement.childNodes[0];
	var removeButton = buttonView.firstChild;
	assert.strictEqual(removeButton.className, "removeButton");
});

QUnit.test("test1to1ShodHaveNoRemoveButton", function(assert) {
	var repeatMin = "1";
	var repeatMax = "1";
	var path = {};
	var attachedPRepeatingElement = this.pRepeatingElementFactory
	.factor(repeatMin, repeatMax, path);
	var view = attachedPRepeatingElement.view;
	
	var repeatingElement = view;
	assert.strictEqual(repeatingElement.childNodes.length, 0);
});

QUnit.test("testRemoveButtonOnclick", function(assert) {
	var repeatMin = "1";
	var repeatMax = "2";
	var path = {};
	var attachedPRepeatingElement = this.pRepeatingElementFactory
	.factor(repeatMin, repeatMax, path);
	var view = attachedPRepeatingElement.view;
	
	var repeatingElement = view;
	var buttonView = repeatingElement.childNodes[0];
	var removeButton = buttonView.firstChild;

	removeButton.onclick();
	// subscription
	var removes = attachedPRepeatingElement.jsBookkeeper.getRemoveDataArray();
	assert.deepEqual(removes.length, 1);

	var firstRemove = removes[0];
	assert.strictEqual(firstRemove.type, "remove");
	var path = {};
	assert.deepEqual(firstRemove.path, path);
});

QUnit.test("testHideRemoveButtonOnclick", function(assert) {
	var repeatMin = "1";
	var repeatMax = "2";
	var path = {};
	var attachedPRepeatingElement = this.pRepeatingElementFactory
	.factor(repeatMin, repeatMax, path);
	var view = attachedPRepeatingElement.view;
	
	var repeatingElement = view;
	var buttonView = repeatingElement.childNodes[0];
	var removeButton = buttonView.firstChild;
	
	assert.ok(removeButton.offsetHeight > 0, "buttonView should be visible");
	
	
	var pRepeatingElement = attachedPRepeatingElement.pRepeatingElement;
	pRepeatingElement.hideRemoveButton();
	assert.ok(removeButton.offsetHeight === 0, "buttonView should be hidden"); 
	
	pRepeatingElement.showRemoveButton();
	assert.ok(removeButton.offsetHeight > 0, "buttonView should be visible");
});
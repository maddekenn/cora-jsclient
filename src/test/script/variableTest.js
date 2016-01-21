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
"use strict";

QUnit.module("CORA.Variable", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.metadataProvider = new MetadataProviderStub();
		this.pubSub = new PubSubSpy();
		this.variableFactory = new CORATEST.VariableFactory(this.metadataProvider, this.pubSub);
	},
	afterEach : function() {
	}
});

var CORATEST = (function(coraTest) {
	"use strict";
	coraTest.VariableFactory = function(metadataProvider, pubSub) {
		
		this.factor = function(path, metadataId, mode) {
			return new CORA.Variable(path, metadataId, mode, metadataProvider, pubSub);
		};
	};
	return coraTest;
}(CORATEST || {}));

QUnit.test("testInitInput", function(assert) {
	var variable = this.variableFactory.factor({},"","input");
	var view = variable.getView();
	this.fixture.appendChild(view);
	var htmlInputTag = view.firstChild;

	assert.equal(htmlInputTag.value, "");
	
	var subscriptions = this.pubSub.getSubscriptions();
	assert.deepEqual(subscriptions.length, 1);
	assert.deepEqual(subscriptions[0].type, "setValue");
	assert.deepEqual(subscriptions[0].path, {});
	assert.deepEqual(subscriptions[0].context, variable);
	assert.ok(subscriptions[0].functionToCall!==undefined);
	
});

QUnit.test("testSetValueInput", function(assert) {
	var variable = this.variableFactory.factor({},"","input");
	var view = variable.getView();
	this.fixture.appendChild(view);
	var htmlInputTag = view.firstChild;
	
	variable.setValue("A Value");
	assert.equal(htmlInputTag.value, "A Value");
});

QUnit.test("testInitOutput", function(assert) {
	var variable = this.variableFactory.factor({},"","output");
	var view = variable.getView();
	this.fixture.appendChild(view);
	var htmlOutputSpan = view.firstChild;
	
	assert.equal(htmlOutputSpan.nodeName, "SPAN");
	assert.equal(htmlOutputSpan.innerHTML, "");
});

QUnit.test("testSetValueOutput", function(assert) {
	var variable = this.variableFactory.factor({},"","output");
	var view = variable.getView();
	this.fixture.appendChild(view);
	var htmlOutputSpan = view.firstChild;
	
	variable.setValue("A Value");
	assert.equal(htmlOutputSpan.innerHTML, "A Value");
});


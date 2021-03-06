/*
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
"use strict";

QUnit.module("genericFactoryTest.js", {
	beforeEach : function() {

		this.dependencies = {
			"dummy" : "dummy"
		};

		this.spec = {
			"testing" : "testing"
		};

	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var genericFactory = CORA.genericFactory("typeToFactor", this.dependencies);
	assert.ok(genericFactory);
	assert.strictEqual(genericFactory.type, "genericFactory");
});

QUnit.test("getTypeToFactor", function(assert) {
	var genericFactory = CORA.genericFactory("typeToFactor", this.dependencies);
	assert.strictEqual(genericFactory.getTypeToFactor(), "typeToFactor");
});

QUnit.test("getDependencies", function(assert) {
	var genericFactory = CORA.genericFactory("typeToFactor", this.dependencies);
	assert.strictEqual(genericFactory.getDependencies(), this.dependencies);
});

QUnit.test("factorTestFactor", function(assert) {
	var genericFactory = CORA.genericFactory("incomingLinksListHandlerView", this.dependencies);
	var factored = genericFactory.factor(this.spec);
	assert.strictEqual(factored.type, "incomingLinksListHandlerView");
});

QUnit.test("factorTestDependencies", function(assert) {
	var genericFactory = CORA.genericFactory("incomingLinksListHandlerView", this.dependencies);
	var factored = genericFactory.factor(this.spec);
	var factoredDependencies = factored.getDependencies();
	assert.strictEqual(factoredDependencies, this.dependencies);
});

QUnit.test("factorTestSpec", function(assert) {
	var genericFactory = CORA.genericFactory("incomingLinksListHandlerView", this.dependencies);
	var factored = genericFactory.factor(this.spec);
	var factoredSpec = factored.getSpec();
	assert.strictEqual(factoredSpec, this.spec);
});

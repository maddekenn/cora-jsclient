/*
 * Copyright 2018 Uppsala University Library
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

QUnit.module("listWithFilterHandlerViewFactoryTest.js", {
	beforeEach : function() {
		this.dependencies = {
			"messageHolderFactory" : CORATEST.messageHolderFactorySpy()
		};
		this.spec = {
			"name" : "someName"
		}
		this.listWithFilterHandlerViewFactory = CORA.listWithFilterHandlerViewFactory(this.dependencies);
	},
	afterEach : function() {
	}
});

QUnit.test("init", function(assert) {
	assert.ok(this.listWithFilterHandlerViewFactory);
	assert.strictEqual(this.listWithFilterHandlerViewFactory.type, "listWithFilterHandlerViewFactory");
}); 

QUnit.test("getDependencies", function(assert) {
	assert.strictEqual(this.listWithFilterHandlerViewFactory.getDependencies(), this.dependencies);
});

QUnit.test("factor", function(assert) {
	var listWithFilterHandlerView = this.listWithFilterHandlerViewFactory.factor(this.spec);
	assert.strictEqual(listWithFilterHandlerView.type, "listWithFilterHandlerView");

	var listWithFilterHandlerViewSpec = listWithFilterHandlerView.getSpec();
	assert.strictEqual(listWithFilterHandlerViewSpec, this.spec);
});

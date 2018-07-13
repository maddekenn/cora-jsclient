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

QUnit.module("listWithFilterHandlerTest.js", {
	beforeEach : function() {
		this.recordType = CORATEST.recordTypeList.dataList.data[0].record;

		this.dependencies = {
			"listWithFilterHandlerViewFactory" : CORATEST
					.standardFactorySpy("listWithFilterHandlerViewSpy"),
			"managedGuiItemFactory" : CORATEST.standardFactorySpy("managedGuiItemSpy"),
			"jsClient" : CORATEST.jsClientSpy(),
			"searchHandlerJSClientIntegratorFactory" : CORATEST.standardFactorySpy("searchHandlerJsClientIntegratorSpy")
		};
		this.spec = {
			"recordTypeRecord" : this.recordType,
			"baseUrl" : "http://epc.ub.uu.se/cora/rest/"
		};
	},
	afterEach : function() {
	}
});

QUnit.test("init", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandler.type, "listWithFilterHandler");
});

QUnit.test("testGetDependencies", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandler.getDependencies(), this.dependencies);
});

QUnit.test("testGetSpec", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandler.getSpec(), this.spec);
});

QUnit.test("testViewIsCreatedUsingFactory", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	var factoredView = this.dependencies.listWithFilterHandlerViewFactory.getFactored(0);
	assert.strictEqual(listWithFilterHandler.getView(), factoredView.getView());
});

QUnit.test("testViewSpec", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	var factoredSpec = this.dependencies.listWithFilterHandlerViewFactory.getSpec(0);
	assert.strictEqual(factoredSpec.headerText, "presentationVar");
	assert.strictEqual(factoredSpec.openListMethod, listWithFilterHandler.openList);
});

QUnit.test("testAddManagedGuiItemPassedOnToView", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	var factoredView = this.dependencies.listWithFilterHandlerViewFactory.getFactored(0);
	var aItem = CORATEST.managedGuiItemSpy();
	listWithFilterHandler.addManagedGuiItem(aItem);
	assert.strictEqual(factoredView.getAddedManagedGuiItem(0), aItem);
});

QUnit.test("testOpenListFactoredSpec", function(assert) {
	var listWithFilterHandler = CORA.listWithFilterHandler(this.dependencies, this.spec);
	listWithFilterHandler.openList();
	var factoredSpec = this.dependencies.searchHandlerJSClientIntegratorFactory.getSpec(0);

	//TODO: det här ska vara id på filter group och filter presentation group från den
	//recordtype som öppnat

	assert.strictEqual(factoredSpec.metadataId, "personFilterGroup");
	assert.strictEqual(factoredSpec.presentationId, "personFilterPGroup");
	assert.strictEqual(factoredSpec.searchLink, this.recordType.actionLinks.search);
});

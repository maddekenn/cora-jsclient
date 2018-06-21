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

QUnit.module("listWithFilterHandlerViewTest.js", {
	beforeEach : function() {
		this.dependencies = {};
		this.spec = {
			"headerText" : "some text",
			"openListMethod" : function() {
			}
		};
	},
	afterEach : function() {
	}
});
QUnit.test("testInit", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandlerView.type, "listWithFilterHandlerView");
});

QUnit.test("testGetDependencies", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandlerView.getDependencies(), this.dependencies);
});

QUnit.test("testGetSpec", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	assert.strictEqual(listWithFilterHandlerView.getSpec(), this.spec);
});

QUnit.test("testGetView", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	var view = listWithFilterHandlerView.getView();
	assert.strictEqual(view.className, "listWithFilter");

	var header = view.firstChild;
	assert.strictEqual(header.className, "header clickable");
	assert.strictEqual(header.textContent, "some text");

	var childrenView = view.childNodes[1];
	assert.strictEqual(childrenView.className, "childrenView");
});

QUnit.test("testMenuOnclick", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	var header = listWithFilterHandlerView.getView().firstChild;
	assert.strictEqual(header.onclick, this.spec.openListMethod);
});

QUnit.test("testAddManagedGuiItem", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	var managedGuiItem = CORATEST.managedGuiItemSpy();
	var createdManagedGuiItem = listWithFilterHandlerView.addManagedGuiItem(managedGuiItem);
	var view = listWithFilterHandlerView.getView();
	var childrenView = view.childNodes[1];
	assert.strictEqual(childrenView.childNodes[0], managedGuiItem.getMenuView());
});

QUnit.test("testRemoveManagedGuiItem", function(assert) {
	var listWithFilterHandlerView = CORA.listWithFilterHandlerView(this.dependencies, this.spec);
	var managedGuiItem = CORATEST.managedGuiItemSpy();
	var createdManagedGuiItem = listWithFilterHandlerView.addManagedGuiItem(managedGuiItem);
	var view = listWithFilterHandlerView.getView();
	var childrenView = view.childNodes[1];
	assert.strictEqual(childrenView.childNodes[0], managedGuiItem.getMenuView());

	// remove
	listWithFilterHandlerView.removeManagedGuiItem(managedGuiItem);
	assert.strictEqual(childrenView.childNodes[0], undefined);
});

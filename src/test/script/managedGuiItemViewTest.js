/*
 * Copyright 2016 Uppsala University Library
 * Copyright 2016, 2017 Olov McKie
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
QUnit.module("managedGuiItemViewTest.js", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.dependencies = {};
		this.spec = {
				"activateMethod" : function(){},
				"removeMenuMethod" :  function(){},
				"removeWorkMethod" :  function(){}
			};
	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	assert.strictEqual(managedGuiItemView.type, "managedGuiItemView");
});

QUnit.test("testGetMenuView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.className, "menuView");
});

QUnit.test("testMenuOnclickCallsActivateMethod", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.onclick, this.spec.activateMethod);
});

QUnit.test("testMenuViewHasRemoveButtonThatCallsRemoveMethods", function(assert) {
	var removeMenuMethodHasBeenCalled  = false;
	this.spec.removeMenuMethod = function(){
		removeMenuMethodHasBeenCalled = true;
	}

	var removeWorkMethodHasBeenCalled  = false;
	this.spec.removeWorkMethod = function(){
		removeWorkMethodHasBeenCalled = true;
	}
	
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.lastChild.className, "removeButton");
	var event = document.createEvent("Event");
	menuView.lastChild.onclick(event);
	assert.ok(removeMenuMethodHasBeenCalled);
	assert.ok(removeWorkMethodHasBeenCalled);
});

QUnit.test("testGetWorkView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.className, "workView");
});

QUnit.test("testAddMenuPresentation", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.childNodes[0].className, "removeButton");
	
	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1].className, "removeButton");
	
	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation2);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1], presentation2);
	assert.strictEqual(menuView.childNodes[2].className, "removeButton");
});

QUnit.test("testAddWorkPresentation", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.dependencies, this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.childNodes[0], undefined);
	
	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addWorkPresentation(presentation);
	assert.strictEqual(workView.childNodes[0], presentation);
	
	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addWorkPresentation(presentation2);
	assert.strictEqual(workView.childNodes[0], presentation);
	assert.strictEqual(workView.childNodes[1], presentation2);
});

/*
 * Copyright 2016, 2019 Uppsala University Library
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
			"activateMethod" : function() {
			},
			"removeMethod" : function() {
			},
			"deleteRecordMethod" : function() {
			},
		};
	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	assert.strictEqual(managedGuiItemView.type, "managedGuiItemView");
});

QUnit.test("testGetMenuView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.className, "menuView");
});

QUnit.test("testMenuOnclickCallsActivateMethod", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.onclick, this.spec.activateMethod);
});

QUnit.test("testMenuViewHasRemoveButtonThatCallsRemoveMethods", function(assert) {
	var removeMethodHasBeenCalled = false;
	this.spec.removeMethod = function() {
		removeMethodHasBeenCalled = true;
	}

	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.lastChild.className, "iconButton removeButton");
	CORATESTHELPER.simulateOnclick(menuView.lastChild);
	
	assert.ok(removeMethodHasBeenCalled);
});
QUnit.test("testMenuViewHasNoRemoveButtonIfNoRemoveMethod", function(assert) {
	this.spec.removeMethod = undefined;
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.childNodes.length, 0);
});

QUnit.test("testGetListView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var listView = managedGuiItemView.getListView();
	assert.strictEqual(listView.nodeName, "SPAN");
	assert.strictEqual(listView.className, "listView");
});

QUnit.test("testGetWorkView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.className, "workView");
});

QUnit.test("testAddMenuPresentation", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.childNodes[0].className, "iconButton removeButton");

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1].className, "iconButton removeButton");

	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation2);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1], presentation2);
	assert.strictEqual(menuView.childNodes[2].className, "iconButton removeButton");
});

QUnit.test("testAddListPresentation", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var listView = managedGuiItemView.getListView();

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addListPresentation(presentation);
	assert.strictEqual(listView.childNodes[0], presentation);

	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addListPresentation(presentation2);
	assert.strictEqual(listView.childNodes[0], presentation);
	assert.strictEqual(listView.childNodes[2], presentation2);
});

QUnit.test("testAddListPresentationHasDeleteButton", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var listView = managedGuiItemView.getListView();

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addListPresentation(presentation);
	
	assert.strictEqual(listView.childNodes[1].className,"iconButton removeButton");
});

QUnit.test("testAddListPresentationHasNoDeleteButtonIfNoDeleteMethod", function(assert) {
	this.spec = {
			"activateMethod" : function() {
			},
			"removeMethod" : function() {
			}
		};
//	this.spec.deleteRecordMethod = undefined;
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var listView = managedGuiItemView.getListView();

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addListPresentation(presentation);
	
	assert.strictEqual(listView.childNodes.length,1);
});

QUnit.test("testClickDeleteInPresentationCallsDeleteMethodInSpec", function(assert) {
	
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var listView = managedGuiItemView.getListView();
	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addListPresentation(presentation);
	assert.strictEqual(listView.lastChild.className, "iconButton removeButton");
	CORATESTHELPER.simulateOnclick(listView.lastChild);
});

QUnit.test("testAddWorkPresentation", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
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

QUnit.test("testUpdateMenuView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.className, "menuView");

	managedGuiItemView.updateMenuView({
		"active" : false,
		"changed" : false
	});
	assert.strictEqual(menuView.className, "menuView");

	managedGuiItemView.updateMenuView({
		"active" : true,
		"changed" : false
	});
	assert.strictEqual(menuView.className, "menuView active");

	managedGuiItemView.updateMenuView({
		"active" : true,
		"changed" : true
	});
	assert.strictEqual(menuView.className, "menuView changed active");

	managedGuiItemView.updateMenuView({
		"active" : false,
		"changed" : true
	});
	assert.strictEqual(menuView.className, "menuView changed");
});

QUnit.test("testClearMenuView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	assert.strictEqual(menuView.childNodes[0].className, "iconButton removeButton");

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1].className, "iconButton removeButton");

	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addMenuPresentation(presentation2);
	assert.strictEqual(menuView.childNodes[0], presentation);
	assert.strictEqual(menuView.childNodes[1], presentation2);
	assert.strictEqual(menuView.childNodes[2].className, "iconButton removeButton");

	managedGuiItemView.clearMenuView();
	assert.strictEqual(menuView.childNodes.length, 1);
	assert.strictEqual(menuView.childNodes[0].className, "iconButton removeButton");
});

QUnit.test("testClearWorkView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.childNodes[0], undefined);

	var presentation = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addWorkPresentation(presentation);
	assert.strictEqual(workView.childNodes[0], presentation);

	var presentation2 = CORA.gui.createSpanWithClassName("someClassName");
	managedGuiItemView.addWorkPresentation(presentation2);
	assert.strictEqual(workView.childNodes[0], presentation);
	assert.strictEqual(workView.childNodes[1], presentation2);

	managedGuiItemView.clearWorkView();
	assert.strictEqual(workView.childNodes[0], undefined);
});

QUnit.test("testHideWorkView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.style.display, "");

	managedGuiItemView.hideWorkView();

	assert.strictEqual(workView.style.display, "none");
});

QUnit.test("testShowWorkView", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var workView = managedGuiItemView.getWorkView();
	assert.strictEqual(workView.style.display, "");

	managedGuiItemView.showWorkView();

	managedGuiItemView.hideWorkView();
	assert.strictEqual(workView.style.display, "none");

	managedGuiItemView.showWorkView();
	assert.strictEqual(workView.style.display, "");
});

QUnit.test("testRemoveViews", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	var workView = managedGuiItemView.getWorkView();

	this.fixture.appendChild(menuView);
	this.fixture.appendChild(workView);

	assert.strictEqual(this.fixture.childNodes.length, 2);

	managedGuiItemView.removeViews();

	assert.strictEqual(this.fixture.childNodes.length, 0);

	assert.strictEqual(menuView.parentNode, null);
	assert.strictEqual(workView.parentNode, null);
});

QUnit.test("testRemoveViewsNotAddedToParentShouldNotCrash", function(assert) {
	var managedGuiItemView = CORA.managedGuiItemView(this.spec);
	var menuView = managedGuiItemView.getMenuView();
	var workView = managedGuiItemView.getWorkView();

	managedGuiItemView.removeViews();

	assert.strictEqual(this.fixture.childNodes.length, 0);

	assert.strictEqual(menuView.parentNode, null);
	assert.strictEqual(workView.parentNode, null);
});

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

QUnit.module("recordTypeHandlerViewTest.js", {
	beforeEach : function() {
		this.dependencies = {
		};
		this.spec = {
			"headerText" : "some text",
			"fetchListMethod" : function() {
			}
		};
	},
	afterEach : function() {
	}
});
QUnit.test("initAndGetView", function(assert) {
	var recordTypeHandlerView = CORA.recordTypeHandlerView(this.dependencies, this.spec);

	var view = recordTypeHandlerView.getView();
	assert.strictEqual(view.className, "recordType");

	var header = view.firstChild;
	assert.strictEqual(header.className, "header");
	assert.strictEqual(header.textContent, "some text");

	var buttonView = view.childNodes[1];
	assert.strictEqual(buttonView.className, "buttonView");

	var childrenView = view.childNodes[2];
	assert.strictEqual(childrenView.className, "childrenView");
	assert.strictEqual(buttonView.childNodes.length, 0);
});

QUnit.test("initWithCreateButtonAsWeHaveACreateNewMethod", function(assert) {
	var createNewMethodIsCalled = false;
	var presentationModeCalled;
	function createNewMethod(presentationMode) {
		presentationModeCalled = presentationMode;
		createNewMethodIsCalled = true;
	}
	this.spec.createNewMethod = createNewMethod;
	var recordTypeHandlerView = CORA.recordTypeHandlerView(this.dependencies, this.spec);

	var view = recordTypeHandlerView.getView();

	var buttonView = view.childNodes[1];
	var createButton = buttonView.childNodes[0];
	assert.strictEqual(createButton.className, "createButton");

	var event = document.createEvent('Event');
	createButton.onclick(event);
	assert.strictEqual(presentationModeCalled, "new");
	assert.strictEqual(createNewMethodIsCalled, true);
});

//QUnit.test("testCreateManagedGuiItem", function(assert) {
//	var recordTypeHandlerView = CORA.recordTypeHandlerView(this.dependencies, this.spec);
//	var someFunction = function() {
//	};
//	var createdManagedGuiItem = recordTypeHandlerView
//			.createManagedGuiItem("someText", someFunction);
//	assert.strictEqual(this.dependencies.jsClient.getCreatedManagedGuiItem(0).handledBy,
//			someFunction);
//});

QUnit.test("testAddManagedGuiItem", function(assert) {
	var recordTypeHandlerView = CORA.recordTypeHandlerView(this.dependencies, this.spec);
//	var managedGuiItem = {
//		"handledBy" : function() {
//		},
//		"workView" : CORA.gui.createSpanWithClassName("workView"),
//		"menuView" : CORA.gui.createSpanWithClassName("menuView")
//	};
	var managedGuiItem = CORATEST.managedGuiItemSpy();
	var createdManagedGuiItem = recordTypeHandlerView.addManagedGuiItem(managedGuiItem);
//	assert.strictEqual(managedGuiItem.menuView.modelObject, managedGuiItem);
	var view = recordTypeHandlerView.getView();
	var childrenView = view.childNodes[2];
	assert.strictEqual(childrenView.childNodes[0], managedGuiItem.getMenuView());

});

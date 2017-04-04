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
QUnit.module("recordHandlerTest.js", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.record = CORATEST.record;
		this.recordAbstract = CORATEST.recordAbstract;
		this.recordWithoutUpdateOrDeleteLink = CORATEST.recordWithoutUpdateOrDeleteLink;
		this.recordWithoutDeleteLink = CORATEST.recordWithoutDeleteLink;

		// this.menuView = document.createElement("span");
		// this.menuView.className = "menuView";
		// this.menuViewParent = document.createElement("span");
		// this.menuViewParent.appendChild(this.menuView);
		//
		// this.workView = document.createElement("span");
		// this.workViewParent = document.createElement("span");
		// this.workViewParent.appendChild(this.workView);

		this.jsClientSpy = {
			"getMetadataIdForRecordTypeId" : function(recordTypeId) {
				return "recordTypeGroup2";
			}
		};
		this.presentation = {
			"getView" : function() {
				var presentationView = document.createElement("span");
				presentationView.className = "fakePresentation";
				return presentationView;
			}
		};

		var presentation = this.presentation;
		this.presentationIdUsed = [];
		var presentationIdUsed = this.presentationIdUsed;
		this.metadataIdsUsedInData = [];
		var metadataIdsUsedInData = this.metadataIdsUsedInData;
		this.pubSub = CORATEST.pubSubSpy();
		this.dataHolderData = {};
		var dataHolderData = this.dataHolderData;
		this.recordGui = {
			"getPresentation" : function(presentationId, metadataIdUsedInData) {
				presentationIdUsed.push(presentationId);
				metadataIdsUsedInData.push(metadataIdUsedInData);
				return presentation;
			},
			"initMetadataControllerStartingGui" : function initMetadataControllerStartingGui() {
			},
			"dataHolder" : {
				"getData" : function() {
					return dataHolderData;
				}
			},
			"validateData" : function() {
				return true;
			},
			"pubSub" : this.pubSub
		};

		var recordGui = this.recordGui;
		this.metadataIdUsed = [];
		var metadataIdUsed = this.metadataIdUsed;
		this.dataDividerUsed = [];
		var dataDividerUsed = this.dataDividerUsed;
		this.recordGuiFactorySpy = {
			"factor" : function(metadataId, data, dataDivider) {
				metadataIdUsed.push(metadataId);
				dataDividerUsed.push(dataDivider);
				return recordGui;
			}
		};

		var recordTypeHandlerSpy = function(spec) {
			var createdRecordHandlers = [];
			function createRecordHandler(presentationMode, record) {
				createdRecordHandlers.push({
					"presentationMode" : presentationMode,
					"record" : record
				});
			}
			function getCreatedRecordHandlers() {
				return createdRecordHandlers;
			}
			return Object.freeze({
				createRecordHandler : createRecordHandler,

				getCreatedRecordHandlers : getCreatedRecordHandlers
			});
		};
		var recordTypeHandlerSpy1 = recordTypeHandlerSpy({});
		this.recordTypeHandlerSpy1 = recordTypeHandlerSpy1;

		this.recordHandlerViewFactorySpy = CORATEST.recordHandlerViewFactorySpy();
		this.ajaxCallFactorySpy = CORATEST.ajaxCallFactorySpy();
		var dependencies = {
			"ajaxCallFactory" : this.ajaxCallFactorySpy,
			"recordGuiFactory" : this.recordGuiFactorySpy,
			"recordHandlerViewFactory" : this.recordHandlerViewFactorySpy,
			"managedGuiItemFactory" : CORATEST.standardFactorySpy("managedGuiItemSpy")
		};
		this.dependencies = dependencies;
		
		var addedManagedGuiItem;
		
		this.recordHandlerSpec = {
			"dependencies" : dependencies,
			"recordTypeHandler" : this.recordTypeHandlerSpy1,
			"recordTypeRecord" : this.record,
			"presentationMode" : "view",
			views : CORATEST.managedGuiItemSpy(),
			"record" : this.record,
			// "jsClient" : this.jsClientSpy
			"jsClient" : CORATEST.jsClientSpy(),
			"addToRecordTypeHandlerMethod" : function(managedGuiItem) {
				addedManagedGuiItem = managedGuiItem;
			}
		};

		this.getAddedManagedGuiItem = function() {
			return addedManagedGuiItem;
		}

		this.answerCall = function(no) {
			var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(no);
			var jsonRecord = JSON.stringify({
				"record" : this.record
			});
			var answer = {
				"spec" : ajaxCallSpy0.getSpec(),
				"responseText" : jsonRecord
			};
			ajaxCallSpy0.getSpec().loadMethod(answer);
		}
		this.answerCallWithoutUpdateOrDeleteLink = function(no) {
			var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(no);
			var jsonRecord = JSON.stringify({
				"record" : this.recordWithoutUpdateOrDeleteLink
			});
			var answer = {
				"spec" : ajaxCallSpy0.getSpec(),
				"responseText" : jsonRecord
			};
			ajaxCallSpy0.getSpec().loadMethod(answer);
		}
		this.answerCallWithoutDeleteLink = function(no) {
			var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(no);
			var jsonRecord = JSON.stringify({
				"record" : this.recordWithoutDeleteLink
			});
			var answer = {
				"spec" : ajaxCallSpy0.getSpec(),
				"responseText" : jsonRecord
			};
			ajaxCallSpy0.getSpec().loadMethod(answer);
		}

	},
	afterEach : function() {
	}
});

QUnit.test("init", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	assert.notStrictEqual(recordHandler, undefined);
	assert.strictEqual(recordHandler.getDataIsChanged(), false);
});
QUnit.test("initTestManagedGuiItemFactoryCalled",
		function(assert) {
			var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

			var managedGuiItemSpy = this.dependencies.managedGuiItemFactory.getFactored(0);
			var managedGuiItemSpec = managedGuiItemSpy.getSpec(0);
			assert.strictEqual(managedGuiItemSpec.activateMethod,
					this.recordHandlerSpec.jsClient.showView);
			assert.strictEqual(managedGuiItemSpec.removeMethod,
					this.recordHandlerSpec.jsClient.removeView);
			assert.ok(managedGuiItemSpy !== undefined);
		});

QUnit.test("initTestManagedGuiItemAddedToRecordTypeHandler", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	var addedManagedGuiItem = this.getAddedManagedGuiItem();
	var managedGuiItemSpy = this.dependencies.managedGuiItemFactory.getFactored(0);
	assert.strictEqual(addedManagedGuiItem, managedGuiItemSpy);
});

QUnit.test("initRecordHandlerView", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var usedSpec = recordHandlerViewSpy.getSpec();

	assert.ok(usedSpec.workItemViewFactory.factor);
	assert.strictEqual(usedSpec.workItemViewFactory.type, "workItemViewFactory");
	assert.strictEqual(usedSpec.workItemViewFactory.getDependencies(),
			this.recordHandlerSpec.dependencies);
	assert.strictEqual(usedSpec.extraClassName, "recordType");

	var editViewChild = recordHandlerViewSpy.getAddedEditView(0);
	assert.strictEqual(editViewChild.className, "fakePresentation");

	var showViewChild = recordHandlerViewSpy.getAddedShowView(0);
	assert.strictEqual(showViewChild.className, "fakePresentation");

	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	assert.strictEqual(updateButtonSpec.text, "DELETE");
	assert.strictEqual(updateButtonSpec.className, "delete");

	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(1);
	assert.strictEqual(updateButtonSpec.text, "UPDATE");
	assert.strictEqual(updateButtonSpec.className, "update");
});

QUnit.test("testShowData", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);
	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);

	var showDataFunction = recordHandlerViewSpy.getShowDataFunction();
	assert.strictEqual(showDataFunction, recordHandler.showData);
	showDataFunction();
	// TODO: test functions showData, needs messages to be handled by view....
	// so that we can test that it is called
	// assert.strictEqual(this.workView.childNodes[0].textContent, "{}");
});

QUnit.test("testCopyAsNew", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);
	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);

	var copyAsNewFunction = recordHandlerViewSpy.getCopyAsNewFunction();
	assert.strictEqual(copyAsNewFunction, recordHandler.copyData);

	copyAsNewFunction();

	var createdRecordHandler = this.recordTypeHandlerSpy1.getCreatedRecordHandlers()[0];
	assert.strictEqual(createdRecordHandler.presentationMode, "new");
	assert.strictEqual(createdRecordHandler.record, this.dataHolderData);
});

QUnit.test("initCallToServer", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(0);

	var ajaxCallSpec = ajaxCallSpy.getSpec();
	assert.strictEqual(ajaxCallSpec.url,
			"http://epc.ub.uu.se/cora/rest/record/recordType/recordType");
	assert.strictEqual(ajaxCallSpec.requestMethod, "GET");
	assert.strictEqual(ajaxCallSpec.accept, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.loadMethod, recordHandler.processFetchedRecord);
});

QUnit.test("initCheckRightGuiCreatedView", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[2], "recordTypeMenuPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[2], "recordTypeGroup");

	assert.strictEqual(this.metadataIdUsed[0], "recordTypeGroup");

	// var messageHolder = this.workView.childNodes[0];
	// var messageHolder =
	// this.recordHandlerSpec.views.getAddedWorkPresentation(0);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var messageHolder = managedGuiItem.getAddedWorkPresentation(0);

	// console.log("messageHolder", messageHolder)
	assert.strictEqual(messageHolder.className, "messageHolder");

	// var menuView = this.menuView;
	// assert.strictEqual(menuView.textContent, "");
	// assert.strictEqual(menuView.childNodes[0].nodeName, "SPAN");
	// var removeButton = menuView.childNodes[1];
	// assert.strictEqual(removeButton.className, "removeButton");

	// var busy = this.workView.childNodes[2];
	// var busy = this.recordHandlerSpec.views.getAddedWorkPresentation(2);
	var busy = managedGuiItem.getAddedWorkPresentation(2);
	assert.strictEqual(busy.className, "busy toBeRemoved");
});

// QUnit.test("initCheckActiveStatusOfMenuViewWhenActive", function(assert) {
// this.recordHandlerSpec.presentationMode = "new";
// this.recordHandlerSpec.views.isActive = true;
// var recordHandler = CORA.recordHandler(this.dependencies,
// this.recordHandlerSpec);
// assert.strictEqual(this.menuView.className, "someClass changed active");
// });
//
// QUnit.test("initCheckActiveStatusOfMenuViewWhenNotActive", function(assert) {
// this.recordHandlerSpec.presentationMode = "new";
// this.recordHandlerSpec.views.isActive = false;
// var recordHandler = CORA.recordHandler(this.dependencies,
// this.recordHandlerSpec);
// assert.strictEqual(this.menuView.className, "someClass changed");
// });

// QUnit.test("initCheckRemoveButtonInMenuView", function(assert) {
// var recordHandler = CORA.recordHandler(this.dependencies,
// this.recordHandlerSpec);
// this.answerCall(0);
//
// var menuView = this.menuView;
// var workView = this.workView;
//
// var removeButton = menuView.childNodes[1];
// assert.strictEqual(removeButton.className, "removeButton");
// var event = document.createEvent('Event');
//
// removeButton.onclick(event);
// assert.strictEqual(menuView.parentNode, null);
// assert.strictEqual(workView.parentNode, null);
// });

QUnit.test("initCheckRightGuiCreatedViewAbstractRecordType", function(assert) {
	this.recordHandlerSpec.recordTypeRecord = this.recordAbstract;
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var usedSpec = recordHandlerViewSpy.getSpec();
	assert.ok(usedSpec.workItemViewFactory.factor);
	assert.strictEqual(usedSpec.extraClassName, "text");

	var editViewChild = recordHandlerViewSpy.getAddedEditView(0);
	assert.strictEqual(editViewChild, undefined);

	var showViewChild = recordHandlerViewSpy.getAddedShowView(0);
	assert.strictEqual(showViewChild.className, "fakePresentation");

	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	assert.strictEqual(updateButtonSpec, undefined);

	assert.strictEqual(this.presentationIdUsed[1], "textMenuPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeGroup");

	// assert.strictEqual(this.menuView.textContent, "");
	// assert.strictEqual(this.menuView.childNodes[0].nodeName, "SPAN");
});

QUnit.test("testInitSubscriptions", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	// subscription
	var subscriptions = this.pubSub.getSubscriptions();
	assert.deepEqual(subscriptions.length, 1);

	var firstSubscription = subscriptions[0];
	assert.strictEqual(firstSubscription.type, "*");
	assert.deepEqual(firstSubscription.path, {});
	assert.ok(firstSubscription.functionToCall === recordHandler.handleMsg);
});

QUnit.test("testHandleMessage", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	var data = {
		"data" : "A new value",
		"path" : {}
	};
	recordHandler.handleMsg(data, "setValue");
	assert.strictEqual(recordHandler.getDataIsChanged(), false);

	var data1 = {
		"data" : "",
		"path" : {}
	};
	recordHandler.handleMsg(data1, "initComplete");
	assert.strictEqual(recordHandler.getDataIsChanged(), false);
	// assert.strictEqual(this.menuView.className, "someClass active");
	assert.strictEqual(this.recordHandlerSpec.views.getChanged(), false);

	recordHandler.handleMsg(data, "setValue");
	assert.strictEqual(recordHandler.getDataIsChanged(), true);
	// assert.strictEqual(this.menuView.className, "someClass changed active");
	// assert.strictEqual(this.recordHandlerSpec.views.getChanged(), true);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	assert.strictEqual(managedGuiItem.getChanged(), true);
});

QUnit.test("testHandleMessageAddDoesNotSetDataChanged", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	var data = {
		"data" : "A new value",
		"path" : {}
	};
	recordHandler.handleMsg(data, "setValue");
	assert.strictEqual(recordHandler.getDataIsChanged(), false);

	var data1 = {
		"data" : "",
		"path" : {}
	};
	recordHandler.handleMsg(data1, "initComplete");
	assert.strictEqual(recordHandler.getDataIsChanged(), false);
	// assert.strictEqual(this.menuView.className, "someClass active");
	assert.strictEqual(this.recordHandlerSpec.views.getChanged(), false);

	recordHandler.handleMsg(data, "add");
	assert.strictEqual(recordHandler.getDataIsChanged(), false);
	// assert.strictEqual(this.menuView.className, "someClass active");
	assert.strictEqual(this.recordHandlerSpec.views.getChanged(), false);

	recordHandler.handleMsg(data, "setValue");
	assert.strictEqual(recordHandler.getDataIsChanged(), true);
	// assert.strictEqual(this.menuView.className, "someClass changed active");
	// assert.strictEqual(this.recordHandlerSpec.views.getChanged(), true);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	assert.strictEqual(managedGuiItem.getChanged(), true);
});

QUnit.test("testUpdateCall", function(assert) {
	this.recordHandlerSpec.presentationMode = "edit";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return true;
	};

	assert.strictEqual(this.metadataIdUsed[0], "recordTypeGroup");
	assert.strictEqual(this.dataDividerUsed[0], "cora");

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeGroup");

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(1);
	updateButtonSpec.onclickMethod();

	assert.strictEqual(validateWasCalled, true);

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	var ajaxCallSpec = ajaxCallSpy.getSpec();
	assert.strictEqual(ajaxCallSpec.url,
			"http://epc.ub.uu.se/cora/rest/record/recordType/recordType");
	assert.strictEqual(ajaxCallSpec.requestMethod, "POST");
	assert.strictEqual(ajaxCallSpec.accept, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.contentType, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.data, "{}");
	assert.strictEqual(ajaxCallSpec.loadMethod, recordHandler.resetViewsAndProcessFetchedRecord);
});

QUnit.test("testUpdateThroughPubSubCall", function(assert) {
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return true;
	};

	var data = {
		"data" : "",
		"path" : {}
	};
	recordHandler.handleMsg(data, "updateRecord");

	assert.strictEqual(validateWasCalled, true);

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	var ajaxCallSpec = ajaxCallSpy.getSpec();
	assert.strictEqual(ajaxCallSpec.url,
			"http://epc.ub.uu.se/cora/rest/record/recordType/recordType");
	assert.strictEqual(ajaxCallSpec.requestMethod, "POST");
	assert.strictEqual(ajaxCallSpec.accept, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.contentType, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.data, "{}");
	assert.strictEqual(ajaxCallSpec.loadMethod, recordHandler.resetViewsAndProcessFetchedRecord);
});

QUnit.test("testUpdateDataIsChanged", function(assert) {
	this.recordHandlerSpec.presentationMode = "edit";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return true;
	};

	var data1 = {
		"data" : "",
		"path" : {}
	};
	recordHandler.handleMsg(data1, "initComplete");
	var data = {
		"data" : "A new value",
		"path" : {}
	};
	recordHandler.handleMsg(data, "setValue");
	assert.strictEqual(recordHandler.getDataIsChanged(), true);

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(1);
	updateButtonSpec.onclickMethod();
	this.answerCall(1);

	assert.strictEqual(recordHandler.getDataIsChanged(), false);
});

QUnit.test("testUpdateCallValidationError", function(assert) {
	this.recordHandlerSpec.presentationMode = "edit";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return false;
	};

	assert.strictEqual(this.metadataIdUsed[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeGroup");

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(1);
	updateButtonSpec.onclickMethod();

	assert.strictEqual(validateWasCalled, true);

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	assert.strictEqual(ajaxCallSpy, undefined);
});

QUnit.test("testNoUpdateButtonAndEditFormWhenNoUpdateLink", function(assert) {
	this.recordHandlerSpec.presentationMode = "edit";
	this.recordHandlerSpec.record = this.recordWithoutUpdateOrDeleteLink;

	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCallWithoutUpdateOrDeleteLink(0);

	assert.strictEqual(this.metadataIdUsed[0], "textSystemOneGroup");

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "textSystemOneGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeMenuPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "textSystemOneGroup");

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);

	var editViewChild = recordHandlerViewSpy.getAddedEditView(0);
	assert.strictEqual(editViewChild, undefined);

	var showViewChild = recordHandlerViewSpy.getAddedShowView(0);
	assert.strictEqual(showViewChild.className, "fakePresentation");

	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	assert.strictEqual(updateButtonSpec, undefined);
});

QUnit.test("testDeleteCall", function(assert) {
	var menuView = this.recordHandlerSpec.views.getMenuView();
	var workView = this.recordHandlerSpec.views.getWorkView();
	this.fixture.appendChild(menuView);
	this.fixture.appendChild(workView);
	this.recordHandlerSpec.presentationMode = "edit";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	assert.strictEqual(this.metadataIdUsed[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "recordTypeGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeGroup");

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var deleteButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	deleteButtonSpec.onclickMethod();

	// var question = this.workView.lastChild;
	// var question = this.recordHandlerSpec.views.getAddedWorkPresentation(3);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var question = managedGuiItem.getAddedWorkPresentation(3);
	assert.strictEqual(question.className, "question");
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	assert.strictEqual(ajaxCallSpy, undefined, "no delete call should have been made yet");

	var buttonNo = question.firstChild.childNodes[1];
	assert.strictEqual(buttonNo.value, "Nej");
	buttonNo.onclick();
	// var question = this.workView.lastChild;
	// var question = this.recordHandlerSpec.views.getAddedWorkPresentation(4);
	assert.notVisible(question);
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	assert.strictEqual(ajaxCallSpy, undefined, "no delete call should have been made yet");

	deleteButtonSpec.onclickMethod();
	// var question = this.workView.lastChild;
	// var question = this.recordHandlerSpec.views.getAddedWorkPresentation(4);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var question = managedGuiItem.getAddedWorkPresentation(4);
	assert.strictEqual(question.className, "question");
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	assert.strictEqual(ajaxCallSpy, undefined, "no delete call should have been made yet");
	var buttonYes = question.firstChild.childNodes[2];
	assert.strictEqual(buttonYes.value, "Ja");
	buttonYes.onclick();

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(1);
	var ajaxCallSpec = ajaxCallSpy.getSpec();
	assert.strictEqual(ajaxCallSpec.url,
			"http://epc.ub.uu.se/cora/rest/record/recordType/recordType");
	assert.strictEqual(ajaxCallSpec.requestMethod, "DELETE");
	assert.strictEqual(ajaxCallSpec.accept, undefined);
	assert.strictEqual(ajaxCallSpec.contentType, undefined);
	assert.strictEqual(ajaxCallSpec.data, undefined);
	assert.strictEqual(ajaxCallSpec.loadMethod, recordHandler.afterDelete);

	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	assert.strictEqual(managedGuiItem.getRemoved(), 0);
	this.answerCall(1);

	// assert.ok(recordHandlerViewSpy.getClearViewsWasCalled());
	assert.strictEqual(managedGuiItem.getRemoved(), 1);

	// var menuView = this.menuView;
	// assert.strictEqual(menuView.parentNode, null);
	// var workView = this.workView;
	// assert.strictEqual(workView.parentNode, null);
});

QUnit.test("testDeleteCallNoParentsForViews", function(assert) {
	// var menuView = document.createElement("span");
	// var workView = document.createElement("span");
	this.recordHandlerSpec.presentationMode = "edit";
	// this.recordHandlerSpec.views = {
	// "menuView" : menuView,
	// "workView" : workView
	// };
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var deleteButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	deleteButtonSpec.onclickMethod();

	var menuView = this.recordHandlerSpec.views.getAddedMenuPresentation(0);
	var workView = this.recordHandlerSpec.views.getAddedWorkPresentation(0);

	// var question = workView.lastChild;
	// var question = this.recordHandlerSpec.views.getAddedWorkPresentation(3);
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var question = managedGuiItem.getAddedWorkPresentation(3);

	var buttonYes = question.firstChild.childNodes[2];
	buttonYes.onclick();
	assert.strictEqual(managedGuiItem.getRemoved(), 0);
	this.answerCall(1);

	assert.strictEqual(managedGuiItem.getRemoved(), 1);
	// assert.ok(recordHandlerViewSpy.getClearViewsWasCalled());
	//
	// assert.strictEqual(menuView.parentNode, null);
	// assert.strictEqual(workView.parentNode, null);
});

QUnit.test("testNoDeleteButtonWhenNoDeleteLink", function(assert) {
	this.recordHandlerSpec.presentationMode = "edit";
	this.recordHandlerSpec.record = this.recordWithoutDeleteLink;

	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCallWithoutDeleteLink(0);

	assert.strictEqual(this.metadataIdUsed[0], "textSystemOneGroup");

	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "textSystemOneGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "textSystemOneGroup");

	assert.strictEqual(this.presentationIdUsed[2], "recordTypeMenuPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[2], "textSystemOneGroup");

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	assert.strictEqual(updateButtonSpec.className, "update");
});

QUnit.test("initCheckRightGuiCreatedNew", function(assert) {
	this.recordHandlerSpec.presentationMode = "new";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(0);
	assert.strictEqual(ajaxCallSpy, undefined, "no call to server on new record");

	assert.strictEqual(this.metadataIdUsed[0], "recordTypeNewGroup");
	assert.strictEqual(this.presentationIdUsed[0], "recordTypeFormNewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[0], "recordTypeNewGroup");

	assert.strictEqual(this.presentationIdUsed[1], "recordTypeMenuPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[1], "recordTypeNewGroup");

	assert.strictEqual(this.presentationIdUsed[2], "recordTypeViewPGroup");
	assert.strictEqual(this.metadataIdsUsedInData[2], "recordTypeNewGroup");

	// assert.strictEqual(this.menuView.textContent, "");
	// assert.strictEqual(this.recordHandlerSpec.views.getMenuView().textContent,
	// "");
	// assert.strictEqual(this.menuView.childNodes[0].nodeName, "SPAN");
	// assert.strictEqual(this.recordHandlerSpec.views.getAddedMenuPresentation(0).nodeName,
	// "SPAN");
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var item = managedGuiItem.getAddedMenuPresentation(0);
	assert.strictEqual(item.nodeName, "SPAN");

});

QUnit.test("testCreateNewCall", function(assert) {
	this.recordHandlerSpec.presentationMode = "new";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return true;
	};

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var createButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	assert.strictEqual(createButtonSpec.className, "create");
	createButtonSpec.onclickMethod();

	assert.strictEqual(validateWasCalled, true);

	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(0);
	var ajaxCallSpec = ajaxCallSpy.getSpec();
	assert.strictEqual(ajaxCallSpec.url, "http://epc.ub.uu.se/cora/rest/record/recordType/");
	assert.strictEqual(ajaxCallSpec.requestMethod, "POST");
	assert.strictEqual(ajaxCallSpec.accept, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.contentType, "application/uub+record+json");
	assert.strictEqual(ajaxCallSpec.data, "{}");
	assert.strictEqual(ajaxCallSpec.loadMethod, recordHandler.resetViewsAndProcessFetchedRecord);
	this.answerCall(0);

	assert.ok(recordHandlerViewSpy.getClearViewsWasCalled());

	var deleteButtonSpec = recordHandlerViewSpy.getAddedButton(1);
	assert.strictEqual(deleteButtonSpec.className, "delete");
	var updateButtonSpec = recordHandlerViewSpy.getAddedButton(2);
	assert.strictEqual(updateButtonSpec.className, "update");
});

QUnit.test("testCreateNewCallValidationError", function(assert) {
	this.recordHandlerSpec.presentationMode = "new";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);

	var validateWasCalled = false;
	this.recordGui.validateData = function() {
		validateWasCalled = true;
		return false;
	};

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);
	var createButtonSpec = recordHandlerViewSpy.getAddedButton(0);
	createButtonSpec.onclickMethod();

	assert.strictEqual(validateWasCalled, true);
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(0);
	assert.strictEqual(ajaxCallSpy, undefined, "no create call should have been made yet");
});

QUnit.test("fetchListCheckError", function(assert) {
	this.recordHandlerSpec.presentationMode = "view";
	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	var ajaxCallSpy = this.ajaxCallFactorySpy.getFactored(0);
	ajaxCallSpy.getSpec().errorMethod({
		"status" : 404
	});

	// assert.strictEqual(this.workView.childNodes[0].textContent,
	// "404");
	// assert.strictEqual(
	// this.recordHandlerSpec.views.getAddedWorkPresentation(0).textContent,
	// "404");
	var managedGuiItem = this.dependencies.managedGuiItemFactory.getFactored(0);
	var item = managedGuiItem.getAddedWorkPresentation(0);
	assert.strictEqual(item.textContent, "404");

});

QUnit.test("checkRightGuiCreatedPresentationMetadataIsMissing", function(assert) {
	var recordGuiFactorySpy = {
		"factor" : function(metadataId, data) {
			throw new Error("missing metadata");
		}
	};
	this.recordHandlerSpec.presentationMode = "view";
	this.dependencies.recordGuiFactory = recordGuiFactorySpy;

	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	this.answerCall(0);

	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);

	assert.strictEqual(recordHandlerViewSpy.getAddedEditView(0).textContent.substring(0, 20),
			"{\"children\":[{\"child");
});

QUnit.test("rightGuiCreatedPresentationMetadataIsMissingForNew", function(assert) {
	var recordGuiFactorySpy = {
		"factor" : function(metadataId, data) {
			throw new Error("missing metadata");
		}
	};
	this.recordHandlerSpec.presentationMode = "new";
	this.dependencies.recordGuiFactory = recordGuiFactorySpy;

	var recordHandler = CORA.recordHandler(this.dependencies, this.recordHandlerSpec);
	var recordHandlerViewSpy = this.recordHandlerViewFactorySpy.getFactored(0);

	assert.strictEqual(recordHandlerViewSpy.getAddedEditView(0).textContent,
			"\"something went wrong, probably missing metadata, " + "Error: missing metadata\"");
});

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
var CORATEST = (function(coraTest) {
	"use strict";
	coraTest.attachedPChildRefHandlerFactory = function(metadataProvider, pubSub, textProvider,
			presentationFactory, fixture) {
		var factor = function(path, parentMetadataId, presentationId) {
			var cParentMetadata = CORA.coraData(metadataProvider.getMetadataById(parentMetadataId));
			var cPresentation = CORA.coraData(metadataProvider.getMetadataById(presentationId));

			var spec = {
				"parentPath" : path,
				"cParentMetadata" : cParentMetadata,
				"cPresentation" : cPresentation,
				"metadataProvider" : metadataProvider,
				"pubSub" : pubSub,
				"textProvider" : textProvider,
				"presentationFactory" : presentationFactory
			};
			var pChildRefHandler = CORA.pChildRefHandler(spec);
			var view = pChildRefHandler.getView();
			fixture.appendChild(view);
			return {
				pChildRefHandler : pChildRefHandler,
				fixture : fixture,
				metadataProvider : metadataProvider,
				pubSub : pubSub,
				view : view
			};

		};
		return Object.freeze({
			factor : factor
		});
	};

	return coraTest;
}(CORATEST || {}));

QUnit.module("CORA.pChildRefHandler", {
	beforeEach : function() {
		this.fixture = document.getElementById("qunit-fixture");
		this.metadataProvider = new MetadataProviderStub();
		this.pubSub = new PubSubSpy();
		this.textProvider = CORATEST.textProviderStub();

		// var spec = {
		// "metadataId" : metadataId,
		// "metadataProvider" : metadataProvider,
		// "pubSub" : pubSub,
		// "textProvider" : textProvider
		// };
		// this.jsBookkeeper = CORA.jsBookkeeper(spec);
		//
		// var specPresentationFactory = {
		// "metadataProvider" : metadataProvider,
		// "pubSub" : pubSub,
		// "textProvider" : textProvider,
		// "jsBookkeeper" : jsBookkeeper
		// };
		// this.presentationFactory =
		// CORA.presentationFactory(specPresentationFactory);
		this.presentationFactory = CORATEST.presentationFactorySpy();

		this.attachedPChildRefHandlerFactory = CORATEST.attachedPChildRefHandlerFactory(
				this.metadataProvider, this.pubSub, this.textProvider, this.presentationFactory,
				this.fixture);
	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor({},
			"groupIdOneTextChild", "pVarTextVariableId");
	var childRefHandler = attachedPChildRefHandler.pChildRefHandler;

	assert.ok(childRefHandler.isRepeating === false);

	var view = attachedPChildRefHandler.view;
	assert.deepEqual(view.className, "pChildRefHandler pVarTextVariableId");
	assert.deepEqual(view.nodeName, "SPAN");
	assert.ok(view.modelObject === childRefHandler,
			"modelObject should be a pointer to the javascript object instance");
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have no children");

	// subscription
	var subscriptions = attachedPChildRefHandler.pubSub.getSubscriptions();
	assert.deepEqual(subscriptions.length, 1);

	var firstSubsription = subscriptions[0];
	assert.strictEqual(firstSubsription.type, "add");
	assert.deepEqual(firstSubsription.path, {});
	assert.ok(firstSubsription.functionToCall === childRefHandler.handleMsg);
});

QUnit.test("testAddOneChild", function(assert) {
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor({},
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.add();

	assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one child");

	var path = {
		"children" : [ {
			"name" : "nameInData",
			"value" : "textVariableId"
		} ],
		"name" : "linkedPath"
	};
	assert.deepEqual(this.presentationFactory.getPath(), path);
});

 QUnit.test("testAddOneChildWithRepeatId", function(assert) {
 var attachedPChildRefHandler =
 this.attachedPChildRefHandlerFactory.factor({},
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.add("one");

	assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one child");
	var path = {
		"children" : [ {
			"name" : "nameInData",
			"value" : "textVariableId"
		}, {
			"name" : "repeatId",
			"value" : "one"
		} ],
		"name" : "linkedPath"
	};
	assert.deepEqual(this.presentationFactory.getPath(), path);

});
QUnit.test("testAddOneChildWithOneLevelPath", function(assert) {
	var path = {
		"children" : [ {
			"name" : "nameInData",
			"value" : "textVariableId"
		} ],
		"name" : "linkedPath"
	};
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor(path,
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.add();

	assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one child");
	var childPath = {
		"children" : [ {
			"name" : "nameInData",
			"value" : "textVariableId"
		}, {
			"children" : [ {
				"name" : "nameInData",
				"value" : "textVariableId"
			} ],
			"name" : "linkedPath"
		} ],
		"name" : "linkedPath"
	};
	assert.deepEqual(this.presentationFactory.getPath(), childPath);

});

QUnit.test("testAddOneChildWithTwoLevelPath", function(assert) {
	var path = {
		"children" : [ {
			"name" : "nameInData1",
			"value" : "textVariableId"
		}, {
			"children" : [ {
				"name" : "nameInData2",
				"value" : "textVariableId"
			} ],
			"name" : "linkedPath"
		} ],
		"name" : "linkedPath"
	};
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor(path,
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.add();

	assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one child");
	var childPath = {
		"children" : [ {
			"name" : "nameInData1",
			"value" : "textVariableId"
		}, {
			"children" : [ {
				"name" : "nameInData2",
				"value" : "textVariableId"
			}, {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVariableId"
				} ]
			} ],
			"name" : "linkedPath"
		} ],
		"name" : "linkedPath"
	};
	assert.deepEqual(this.presentationFactory.getPath(), childPath);
});

// groupInGroupOneTextChild
// groupIdOneTextChildTwoAttributes
// use this to make sure path contains attributes...

// QUnit.test("testAddChildWithAttributesInPath", function (assert) {
// var path = {};
// var attachedPChildRefHandler =
// this.attachedPChildRefHandlerFactory.factor(path,
// "groupInGroupOneTextChildTwoAttributes",
// "pgGroupIdOneTextOneTextChildTwoAttributes");
// var view = attachedPChildRefHandler.view;
// assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero
// children");
//	
// attachedPChildRefHandler.pChildRefHandler.add();
//	
// assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one
// child");
// var variableView = view.firstChild;
// assert.strictEqual(variableView.className, "pVar pVarTextVariableId");
//	
// // subscription
// var subscriptions = attachedPChildRefHandler.pubSub.getSubscriptions();
// assert.deepEqual(subscriptions.length, 2);
//	
// var firstSubsription = subscriptions[1];
// assert.strictEqual(firstSubsription.type, "setValue");
// var childPath = {
// "children" : [ {
// "name" : "nameInData1",
// "value" : "textVariableId"
// }, {
// "children" : [ {
// "name" : "nameInData2",
// "value" : "textVariableId"
// }, {
// "name" : "linkedPath",
// "children" : [ {
// "name" : "nameInData",
// "value" : "textVariableId"
// } ]
// } ],
// "name" : "linkedPath"
// } ],
// "name" : "linkedPath"
// };
// assert.deepEqual(firstSubsription.path, childPath);
//	
// });

QUnit.test("testHandleMessageRightMetadataId", function(assert) {
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor({},
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.handleMsg({
		"metadataId" : "textVariableId"
	});

	assert.ok(view.childNodes.length === 1, "pChildRefHandler, should have one child");
	var variableView = view.firstChild;
});

QUnit.test("testHandleMessageNotRightMetadataId", function(assert) {
	var attachedPChildRefHandler = this.attachedPChildRefHandlerFactory.factor({},
			"groupIdOneTextChild", "pVarTextVariableId");
	var view = attachedPChildRefHandler.view;
	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");

	attachedPChildRefHandler.pChildRefHandler.handleMsg({
		"metadataId" : "textVariableIdNOT"
	});

	assert.ok(view.childNodes.length === 0, "pChildRefHandler, should have zero children");
});
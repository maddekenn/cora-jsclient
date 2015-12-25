/*
 * Copyright 2015 Olov McKie
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

QUnit.module("CORA.CoraData", {
	setup : function() {
		// this.metadataProvider = new MetadataProviderStub();
		// this.pubSub = new PubSubSpy();
	},
	teardown : function() {
	}
});

QUnit.test("testGetData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var dataFound = coraData.getData();
	assert.deepEqual(JSON.stringify(dataFound), JSON.stringify(data));
});

QUnit.test("testContainsChildWithNameInData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.ok(coraData.containsChildWithNameInData("textVariableId"));
});

QUnit.test("testContainsChildWithNameInData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.notOk(coraData.containsChildWithNameInData("textVariableId_NOT_FOUND"));
});

QUnit.test("testGetFirstChildByNameInData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var firstChild = {
		"name" : "textVariableId",
		"value" : "A Value"
	};
	var firstChildFound = coraData.getFirstChildByNameInData("textVariableId");
	assert.deepEqual(JSON.stringify(firstChildFound), JSON.stringify(firstChild));
});

QUnit.test("testGetFirstChildByNameInDataNotFound", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.throws(function() {
		coraData.getFirstChildByNameInData("textVariableId_NOT_FOUND");
	}, "Error");
});

QUnit.test("testGetFirstAtomicValueByNameInData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var firstChild = "A Value";
	var atomicValueFound = coraData.getFirstAtomicValueByNameInData("textVariableId");
	assert.deepEqual(JSON.stringify(atomicValueFound), JSON.stringify(firstChild));
});

QUnit.test("testGetNoOfChildrenWithNameInData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var noFound = coraData.getNoOfChildrenWithNameInData("textVariableId");
	assert.deepEqual(noFound, 1);
});

QUnit.test("testGetNoOfChildrenWithNameInDataNotFound", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var noFound = coraData.getNoOfChildrenWithNameInData("textVariableId_NOT_FOUND");
	assert.deepEqual(noFound, 0);
});

QUnit.test("testGetNoOfChildrenWithNameInDataTwo", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var noFound = coraData.getNoOfChildrenWithNameInData("textVariableId");
	assert.deepEqual(noFound, 2);
});

QUnit.test("testContainsChildWithNameInDataAndIndex", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.ok(coraData.containsChildWithNameInDataAndIndex("textVariableId", 0));
});

QUnit.test("testContainsChildWithNameInDataAndIndex1", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.ok(coraData.containsChildWithNameInDataAndIndex("textVariableId", 1));
});

QUnit.test("testContainsChildWithNameInDataAndIndex2", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.notOk(coraData.containsChildWithNameInDataAndIndex("textVariableId", 2));
});

QUnit.test("testContainsChildWithNameInDataAndIndexNotFound", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.notOk(coraData.containsChildWithNameInDataAndIndex("textVariableId_NOT_FOUND", 1));
});

QUnit.test("testGetChildByNameInDataAndIndex", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var firstChild = {
		"name" : "textVariableId",
		"value" : "A Value",
		"repeatId" : "1"
	};
	var firstChildFound = coraData.getChildByNameInDataAndIndex("textVariableId", 0);
	assert.deepEqual(JSON.stringify(firstChildFound), JSON.stringify(firstChild));
});

QUnit.test("testGetChildByNameInDataAndIndex1", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	var firstChild = {
		"name" : "textVariableId",
		"value" : "A Value2",
		"repeatId" : "2"
	};
	var firstChildFound = coraData.getChildByNameInDataAndIndex("textVariableId", 1);
	assert.deepEqual(JSON.stringify(firstChildFound), JSON.stringify(firstChild));
});

QUnit.test("testGetChildByNameInDataAndIndexNotFound", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.throws(function() {
		coraData.getChildByNameInDataAndIndex("textVariableId_NOT_FOUND", 1);
	}, "Error");
});

QUnit.test("testGetAtomicValueByNameInDataAndIndex1", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "1"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "2"
		} ]
	};
	var coraData = new CORA.CoraData(data);
	assert.deepEqual("A Value", coraData.getAtomicValueByNameInDataAndIndex("textVariableId", 0));
});

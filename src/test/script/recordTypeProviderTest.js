/*
 * Copyright 2016 Olov McKie
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

QUnit.module("recordTypeProviderTest.js", {
	beforeEach : function() {
		var xmlHttpRequestFactoryMultipleSpy = CORATEST.xmlHttpRequestFactoryMultipleSpy();
		xmlHttpRequestFactoryMultipleSpy.setResponseStatus(200);
		var responseText = JSON.stringify(CORATEST.recordTypeList);
		xmlHttpRequestFactoryMultipleSpy.setResponseText(responseText);
		
		var dependencies = {
			"xmlHttpRequestFactory" : xmlHttpRequestFactoryMultipleSpy
		};
		this.dependencies = dependencies;

		var recordTypeListLink = {
			"requestMethod" : "GET",
			"rel" : "list",
			"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/",
			"accept" : "application/uub+recordList+json"
		};
		this.recordTypeListLink = recordTypeListLink;

		var spec = {
			"dependencies" : dependencies,
			"recordTypeListLink" : recordTypeListLink
		};
		
		this.spec = spec;
		this.recordTypeListLink = recordTypeListLink;
		this.recordTypeListLinkJson = JSON.stringify(this.recordTypeListLink);

		this.xmlHttpRequestFactoryMultipleSpy = xmlHttpRequestFactoryMultipleSpy;
		
	},
	afterEach : function() {
	}
});

QUnit.test("initCorrectRequestMade", function(assert) {
	var provider = CORA.recordTypeProvider(this.spec);
	var xmlHttpRequestSpy = this.xmlHttpRequestFactoryMultipleSpy.getFactoredXmlHttpRequest(0);

	var openUrl = xmlHttpRequestSpy.getOpenUrl();
	var openUrls = xmlHttpRequestSpy.getOpenUrls();
	var openUrl0 = openUrls[0];
	assert.strictEqual(openUrl0.substring(0, openUrl0.indexOf("?")),
			"http://epc.ub.uu.se/cora/rest/record/recordType/");
	assert.strictEqual(xmlHttpRequestSpy.getOpenMethod(), "GET");
	assert.strictEqual(xmlHttpRequestSpy.addedRequestHeaders["accept"][0],
			"application/uub+recordList+json");
	assert.strictEqual(xmlHttpRequestSpy.addedRequestHeaders["content-type"], undefined);

});

QUnit.test("initCallWhenReadyCalledWhenReady", function(assert) {
	var providerStarted = false;
	function providerReady() {
		providerStarted = true;
	}
	
	var xmlHttpRequestFactoryMultipleSpy = this.xmlHttpRequestFactoryMultipleSpy;
	xmlHttpRequestFactoryMultipleSpy.setSendResponse(false);
	
	var spec = this.spec;
	spec.callWhenReady = providerReady;
	var provider = CORA.recordTypeProvider(spec);

	var xmlHttpRequestSpy = xmlHttpRequestFactoryMultipleSpy.getFactoredXmlHttpRequest(0);
	
	assert.notOk(providerStarted);

	xmlHttpRequestSpy.runLoadFunction();
	
	assert.ok(providerStarted);
});

QUnit.test("initCallWhenReadyNotCalledWhenReadyIfUnspecified", function(assert) {
	var providerStarted = false;
	function providerReady() {
		providerStarted = true;
	}
	
	var xmlHttpRequestFactoryMultipleSpy = this.xmlHttpRequestFactoryMultipleSpy;
	xmlHttpRequestFactoryMultipleSpy.setSendResponse(false);
	
	var spec = this.spec;
	var provider = CORA.recordTypeProvider(spec);
	
	var xmlHttpRequestSpy = xmlHttpRequestFactoryMultipleSpy.getFactoredXmlHttpRequest(0);
	
	assert.notOk(providerStarted);
	
	xmlHttpRequestSpy.runLoadFunction();
	
	assert.notOk(providerStarted);
});

QUnit.test("testInitEnteredLinkIsNotChanged", function(assert) {
	var provider = CORA.recordTypeProvider(this.spec);
	var recordTypeListLinkJson = this.recordTypeListLinkJson;
	var recordTypeListLinkJsonAfter = JSON.stringify(this.recordTypeListLink);
	assert.deepEqual(recordTypeListLinkJsonAfter, recordTypeListLinkJson);
});

QUnit.test("getRecordTypeById", function(assert) {
	var provider = CORA.recordTypeProvider(this.spec);
	var expected = {
		"data" : {
			"children" : [ {
				"children" : [ {
					"name" : "id",
					"value" : "textSystemOne"
				}, {
					"name" : "type",
					"value" : "recordType"
				}, {
					"name" : "createdBy",
					"value" : "userId"
				}, {
					"name" : "updatedBy",
					"value" : "userId"
				}, {
					"children" : [ {
						"name" : "linkedRecordType",
						"value" : "system"
					}, {
						"name" : "linkedRecordId",
						"value" : "cora"
					} ],
					"actionLinks" : {
						"read" : {
							"requestMethod" : "GET",
							"rel" : "read",
							"url" : "http://localhost:8080/therest/rest/record/system/cora",
							"accept" : "application/uub+record+json"
						}
					},
					"name" : "dataDivider"
				} ],
				"name" : "recordInfo"
			}, {
				"name" : "metadataId",
				"value" : "textSystemOneGroup"
			}, {
				"name" : "presentationViewId",
				"value" : "textSystemOneViewPGroup"
			}, {
				"name" : "presentationFormId",
				"value" : "textSystemOneFormPGroup"
			}, {
				"name" : "newMetadataId",
				"value" : "textSystemOneNewGroup"
			}, {
				"name" : "newPresentationFormId",
				"value" : "textSystemOneFormNewPGroup"
			}, {
				"name" : "menuPresentationViewId",
				"value" : "textSystemOneMenuPGroup"
			}, {
				"name" : "listPresentationViewId",
				"value" : "textSystemOneListPGroup"
			}, {
				"name" : "searchMetadataId",
				"value" : "textSystemOneSearchGroup"
			}, {
				"name" : "searchPresentationFormId",
				"value" : "textSystemOneFormSearchPGroup"
			}, {
				"name" : "userSuppliedId",
				"value" : "true"
			}, {
				"name" : "permissionKey",
				"value" : "RECORDTYPE_TEXTSYSTEMONE"
			}, {
				"name" : "selfPresentationViewId",
				"value" : "textSystemOneViewSelfPGroup"
			}, {
				"name" : "abstract",
				"value" : "false"
			}, {
				"name" : "parentId",
				"value" : "text"
			} ],
			"name" : "recordType"
		},
		"actionLinks" : {
			"search" : {
				"requestMethod" : "GET",
				"rel" : "search",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/",
				"accept" : "application/uub+recordList+json"
			},
			"read" : {
				"requestMethod" : "GET",
				"rel" : "read",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/textSystemOne",
				"accept" : "application/uub+record+json"
			},
			"update" : {
				"requestMethod" : "POST",
				"rel" : "update",
				"contentType" : "application/uub+record+json",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/textSystemOne",
				"accept" : "application/uub+record+json"
			},
			"create" : {
				"requestMethod" : "POST",
				"rel" : "create",
				"contentType" : "application/uub+record+json",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/",
				"accept" : "application/uub+record+json"
			},
			"list" : {
				"requestMethod" : "GET",
				"rel" : "list",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/",
				"accept" : "application/uub+recordList+json"
			},
			"delete" : {
				"requestMethod" : "DELETE",
				"rel" : "delete",
				"url" : "http://epc.ub.uu.se/cora/rest/record/recordType/textSystemOne"
			}
		}
	};
	var x = provider.getRecordTypeById("textSystemOne");
	assert.stringifyEqual(x, expected);
});

QUnit.test("getRecordTypeByIdNotFound", function(assert) {
	var provider = CORA.recordTypeProvider(this.spec);
	var error = false;
	try {
		var x = provider.getRecordTypeById("someNonExistingRecordTypeId");
	} catch (e) {
		error = true;
	}
	assert.ok(error);
});

QUnit.test("getAllRecordTypes", function(assert) {
	var provider = CORA.recordTypeProvider(this.spec);
	var recordTypeList = provider.getAllRecordTypes();
	assert.stringifyEqual(recordTypeList.length, 15);

});

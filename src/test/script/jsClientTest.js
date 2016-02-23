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

QUnit.module("jsClientTest.js", {
	beforeEach : function() {
	},
	afterEach : function() {
	}
});

QUnit.test("init", function(assert) {
	var recordTypeListData = CORATEST.recordTypeList;
	var xmlHttpRequestSpy = CORATEST.xmlHttpRequestSpy(sendFunction);
	function sendFunction() {
		xmlHttpRequestSpy.status = 200;
		xmlHttpRequestSpy.responseText = JSON.stringify(recordTypeListData);
		xmlHttpRequestSpy.addedEventListeners["load"][0]();
	}

	var dependencies = {
		"metadataProvider" : CORATEST.metadataProviderRealStub(),
		"textProvider" : CORATEST.textProviderRealStub(),
		"xmlHttpRequestFactory" : CORATEST.xmlHttpRequestFactorySpy(xmlHttpRequestSpy),
		"presentationFactoryFactory" : "not implemented yet"
	}
	var spec = {
		"dependencies" : dependencies,
		"name" : "The Client",
		"baseUrl" : "http://epc.ub.uu.se/cora/rest/"
	};
	var jsClient = CORA.jsClient(spec);
	var mainView = jsClient.getView();

	var openUrl = xmlHttpRequestSpy.getOpenUrl();
	assert.strictEqual(openUrl.substring(0, openUrl.indexOf("?")),
			"http://epc.ub.uu.se/cora/rest/record/recordType");
	assert.strictEqual(xmlHttpRequestSpy.getOpenMethod(), "GET");
	assert.strictEqual(xmlHttpRequestSpy.addedRequestHeaders["accept"][0],
			"application/uub+recordList+json");
	assert.strictEqual(xmlHttpRequestSpy.addedRequestHeaders["content-type"][0],
			"application/uub+record+json");

	assert.strictEqual(mainView.modelObject, jsClient);

	assert.strictEqual(mainView.className, "jsClient mainView");

	var header = mainView.childNodes[0];
	assert.strictEqual(header.className, "header");
	assert.strictEqual(header.innerHTML, "The Client");

	var sideBar = mainView.childNodes[1];
	assert.strictEqual(sideBar.className, "sideBar");

	var workArea = mainView.childNodes[2];
	assert.strictEqual(workArea.className, "workArea");

	var recordTypeList = jsClient.getRecordTypeList();
	// console.log(recordTypeList)
	assert.strictEqual(recordTypeList.length, 15);

	var firstRecordType = sideBar.childNodes[0];
	assert.strictEqual(firstRecordType.className, "recordType");
	assert.strictEqual(firstRecordType.firstChild.textContent, "presentationVar");
});

QUnit.test("showView", function(assert) {
	var recordTypeListData = CORATEST.recordTypeList;
	var xmlHttpRequestSpy = CORATEST.xmlHttpRequestSpy(sendFunction);
	function sendFunction() {
		xmlHttpRequestSpy.status = 200;
		xmlHttpRequestSpy.responseText = JSON.stringify(recordTypeListData);
		xmlHttpRequestSpy.addedEventListeners["load"][0]();
	}

	var dependencies = {
		"metadataProvider" : CORATEST.metadataProviderRealStub(),
		"textProvider" : CORATEST.textProviderRealStub(),
		"xmlHttpRequestFactory" : CORATEST.xmlHttpRequestFactorySpy(xmlHttpRequestSpy),
		"presentationFactoryFactory" : "not implemented yet"
	}
	var spec = {
		"dependencies" : dependencies,
		"name" : "The Client",
		"baseUrl" : "http://epc.ub.uu.se/cora/rest/"
	};
	var jsClient = CORA.jsClient(spec);
	var mainView = jsClient.getView();

	var workAreaChildren = mainView.childNodes[2].childNodes;
	assert.strictEqual(workAreaChildren.length, 0);

	var workView1 = document.createElement("span");
	var menuView1 = document.createElement("span");
	menuView1.className ="menuView1";
	var aView = {
		"workView" : workView1,
		"menuView" : menuView1
	};
	jsClient.showView(aView);
	assert.strictEqual(workAreaChildren[0], aView.workView);
	assert.strictEqual(menuView1.className, "menuView1 active");

	var workView2 = document.createElement("span");
	var menuView2 = document.createElement("span");
	menuView2.className ="menuView2";
	var aDifferentView = {
			"workView" : workView2,
			"menuView" : menuView2
	};
	jsClient.showView(aDifferentView);
	assert.strictEqual(workAreaChildren[0], aDifferentView.workView);

	assert.strictEqual(menuView1.className, "menuView1");
	assert.strictEqual(menuView2.className, "menuView2 active");
});

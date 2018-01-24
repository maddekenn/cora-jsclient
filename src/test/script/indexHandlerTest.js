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

QUnit.module("indexHandlerTest.js",{
					beforeEach : function() {
						this.ajaxCallFactorySpy = CORATEST.ajaxCallFactorySpy();
						this.dependencies = {
							"ajaxCallFactory" : this.ajaxCallFactorySpy
						};
						this.spec = {
								"loadMethod" : function() {
								}
						};

					},
					afterEach : function() {
					}
				});

QUnit.test("testType", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
	assert.strictEqual(indexHandler.type, "indexHandler");
});

QUnit.test("testGetDependencies", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
	assert.strictEqual(indexHandler.getDependencies(), this.dependencies);
});

QUnit.test("testGetSpec", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
	assert.strictEqual(indexHandler.getSpec(), this.spec);
});

QUnit.test("testIndexQue", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
//	var menuView = this.uploadManager.view.getMenuView();
//	assert.strictEqual(menuView.className, "menuView");
//	var cRecord = CORA.coraData(CORATEST.listWithDataToIndex.dataList.data);
	var record = CORATEST.listWithDataToIndex.dataList.data[0];
	
	indexHandler.indexData(record);
//	uploadManager.upload(this.uploadSpec);

	var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(0);
	assert.strictEqual(ajaxCallSpy0.getSpec().requestMethod, "POST");
	assert.strictEqual(ajaxCallSpy0.getSpec().loadMethod, this.spec.loadMethod);

	indexHandler.indexData(record);
	assert.strictEqual(this.ajaxCallFactorySpy.getFactored(1), undefined);
	indexHandler.uploadFinished();

	var ajaxCallSpy1 = this.ajaxCallFactorySpy.getFactored(1);
	assert.strictEqual(ajaxCallSpy1.getSpec().requestMethod, "POST");
	indexHandler.uploadFinished();
//	assert.strictEqual(ajaxCallSpy1.getSpec().requestMethod, "POST");
//	this.assertAjaxCallSpecIsCorrect(assert, ajaxCallSpy1);
//
//	uploadManager.uploadFinished();
//	assert.strictEqual(menuView.className, "menuView");
});

QUnit.test("testIndexWithDefaultLoadMethod", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, {});
	var record = CORATEST.listWithDataToIndex.dataList.data[0];
	
	indexHandler.indexData(record);

	var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(0);
	assert.strictEqual(ajaxCallSpy0.getSpec().loadMethod, indexHandler.uploadFinished);

});


QUnit.test("testHandleCallErrorDoesNothing", function(assert) {
	var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
	try {
		indexHandler.handleCallError();
	} catch (error) {
		assert.strictEqual(error.message, "error indexing");
	}
	
//	QUnit.test("testUploadTimeout", function(assert) {
//		var indexHandler = CORA.indexHandler(this.dependencies, this.spec);
//		var record = CORATEST.listWithDataToIndex.dataList.data[0];
//		
//		indexHandler.indexData(record);
//		var ajaxCallSpy0 = this.ajaxCallFactorySpy.getFactored(0);
//		ajaxCallSpy0.getSpec().timeoutMethod();
//
//		var fileView = indexHandler.view.getWorkView().firstChild;
//		assert.strictEqual(fileView.lastChild.textContent, "TIMEOUT");
//	});


});

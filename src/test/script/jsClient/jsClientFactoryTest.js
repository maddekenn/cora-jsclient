/*
 * Copyright 2017 Olov McKie
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

QUnit.module("jsClientFactoryTest.js", {
	beforeEach : function() {
		this.providers = {
			"recordTypeProvider" : CORATEST.recordTypeProviderSpy(),
			"textProvider" : CORATEST.textProviderSpy(),
			"metadataProvider" : CORATEST.metadataProviderSpy(),
			"searchProvider" : CORATEST.searchProviderSpy()
		};
		this.dependencies = {
			"authTokenHolder" : CORATEST.authTokenHolderSpy()
		};
		this.spec = {};
	},
	afterEach : function() {
	}
});

QUnit.test("init", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	assert.strictEqual(jsClientFactory.type, "jsClientFactory");
});

QUnit.test("factorTestType", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClient = jsClientFactory.factor(this.spec);
	assert.strictEqual(jsClient.type, "jsClient");
});

QUnit.test("factorTestDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClient = jsClientFactory.factor(this.spec);
	var factoredDep = jsClient.getDependencies();
	assert.strictEqual(factoredDep.jsClientViewFactory.type, "jsClientViewFactory");
	assert.strictEqual(factoredDep.authTokenHolder, this.dependencies.authTokenHolder);
	assert.strictEqual(factoredDep.ajaxCallFactory.type, "ajaxCallFactory");
	assert.strictEqual(factoredDep.appTokenLoginFactory.type, "appTokenLoginFactory");
	assert.strictEqual(factoredDep.loginManagerFactory.type, "loginManagerFactory");
	assert.strictEqual(factoredDep.openGuiItemHandlerFactory.type, "openGuiItemHandlerFactory");
	assert.strictEqual(factoredDep.openGuiItemHandlerFactory,
			factoredDep.factories.openGuiItemHandlerFactory);
	assert.strictEqual(factoredDep.searchRecordHandlerFactory.type, "searchRecordHandlerFactory");
	assert.strictEqual(factoredDep.recordTypeHandlerFactory.type, "recordTypeHandlerFactory");

	assert.strictEqual(factoredDep.metadataProvider, this.providers.metadataProvider);
	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
	assert.strictEqual(factoredDep.searchProvider, this.providers.searchProvider);
	assert.strictEqual(factoredDep.recordTypeProvider, this.providers.recordTypeProvider);

	assert.strictEqual(factoredDep.uploadManager.type, "uploadManager");
});

QUnit.test("testAjaxCallFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var factoredDep = jsClientFactory.factor(this.spec).getDependencies().ajaxCallFactory
			.getDependencies();
	assert.strictEqual(factoredDep.xmlHttpRequestFactory.type, "xmlHttpRequestFactory");
	assert.strictEqual(factoredDep.authTokenHolder, this.dependencies.authTokenHolder);
});

QUnit.test("testAppTokenLoginFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.appTokenLoginFactory.getDependencies();
	assert.strictEqual(factoredDep.ajaxCallFactory, jsClientFactoredDep.factories.ajaxCallFactory);
});

QUnit.test("testloginManagerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.loginManagerFactory.getDependencies();
	assert.strictEqual(factoredDep.authTokenHolder, this.dependencies.authTokenHolder);
	assert.strictEqual(factoredDep.appTokenLoginFactory,
			jsClientFactoredDep.factories.appTokenLoginFactory);
	assert.strictEqual(factoredDep.ajaxCallFactory, jsClientFactoredDep.factories.ajaxCallFactory);
	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
});

QUnit.test("testOpenGuiItemHandlerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.openGuiItemHandlerFactory.getDependencies();
	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
});

QUnit.test("testUploadManagerDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.uploadManager.getDependencies();
	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
	assert.strictEqual(factoredDep.ajaxCallFactory, jsClientFactoredDep.factories.ajaxCallFactory);
	assert.strictEqual(factoredDep.managedGuiItemFactory,
			jsClientFactoredDep.factories.managedGuiItemFactory);
});

QUnit.test("testRecordGuiFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.factories.recordGuiFactory.getDependencies();

	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
	assert.strictEqual(factoredDep.ajaxCallFactory, jsClientFactoredDep.factories.ajaxCallFactory);
	assert.strictEqual(factoredDep.recordTypeProvider, this.providers.recordTypeProvider);
	assert.strictEqual(factoredDep.metadataProvider, this.providers.metadataProvider);
	assert.strictEqual(factoredDep.authTokenHolder, this.dependencies.authTokenHolder);
	assert.strictEqual(factoredDep.uploadManager.type, "uploadManager");
});

QUnit.test("testsearchRecordHandlerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.searchRecordHandlerFactory.getDependencies();
	assert.strictEqual(factoredDep.searchRecordHandlerViewFactory.type,
			"searchRecordHandlerViewFactory");
	assert.strictEqual(factoredDep.searchRecordHandlerViewFactory,
			jsClientFactoredDep.factories.searchRecordHandlerViewFactory);
	assert.strictEqual(factoredDep.textProvider, this.providers.textProvider);
	assert.strictEqual(factoredDep.ajaxCallFactory, jsClientFactoredDep.factories.ajaxCallFactory);
	assert
			.strictEqual(factoredDep.recordGuiFactory,
					jsClientFactoredDep.factories.recordGuiFactory);
});

QUnit.test("testRecordTypeHandlerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();
	var factoredDep = jsClientFactoredDep.recordTypeHandlerFactory.getDependencies();

	assert.strictEqual(factoredDep.factories.recordGuiFactory,
			jsClientFactoredDep.factories.recordGuiFactory);
	assert.strictEqual(factoredDep.factories.ajaxCallFactory,
			jsClientFactoredDep.factories.ajaxCallFactory);
});

QUnit.test("testResultHandlerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();

	var factories = jsClientFactoredDep.factories;
	var resultHandlerFactory = factories.resultHandlerFactory;
	assert.strictEqual(resultHandlerFactory.type, "resultHandlerFactory");

	var dependencies = resultHandlerFactory.getDependencies();
	assert.strictEqual(dependencies.textProvider, this.providers.textProvider);
	assert.strictEqual(dependencies.recordHandlerFactory, factories.recordHandlerFactory);
});

QUnit.test("testRecordTypeHandlerViewFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();

	var factories = jsClientFactoredDep.factories;
	var recordTypeHandlerViewFactory = factories.recordTypeHandlerViewFactory;
	assert.strictEqual(recordTypeHandlerViewFactory.type, "recordTypeHandlerViewFactory");
});

QUnit.test("testRecordHandlerFactoryDependencies", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();

	var factories = jsClientFactoredDep.factories;
	var recordHandlerFactory = factories.recordHandlerFactory;
	assert.strictEqual(recordHandlerFactory.type, "recordHandlerFactory");

	var dependencies = recordHandlerFactory.getDependencies();
	assert.strictEqual(dependencies.ajaxCallFactory, factories.ajaxCallFactory);
	assert.strictEqual(dependencies.recordGuiFactory, factories.recordGuiFactory);
	assert.strictEqual(dependencies.managedGuiItemFactory, factories.managedGuiItemFactory);
});

QUnit
		.test("testRecordListHandlerFactoryDependencies",
				function(assert) {
					var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
					var jsClientFactoredDep = jsClientFactory.factor(this.spec).getDependencies();

					var factories = jsClientFactoredDep.factories;
					var recordListHandlerFactory = factories.recordListHandlerFactory;
					assert.strictEqual(recordListHandlerFactory.type, "recordListHandlerFactory");

					var dependencies = recordListHandlerFactory.getDependencies();
					assert.strictEqual(dependencies.factories.ajaxCallFactory,
							factories.ajaxCallFactory);
					assert.strictEqual(dependencies.factories.recordGuiFactory,
							factories.recordGuiFactory);
					assert.strictEqual(dependencies.factories.managedGuiItemFactory,
							factories.managedGuiItemFactory);
					assert.strictEqual(dependencies.factories.recordHandlerFactory,
							factories.recordHandlerFactory);
					assert.strictEqual(dependencies.factories.resultHandlerFactory,
							factories.resultHandlerFactory);
				});

QUnit.test("testSpecSentToJSClient", function(assert) {
	var jsClientFactory = CORA.jsClientFactory(this.providers, this.dependencies);
	var jsClient = jsClientFactory.factor(this.spec);
	assert.strictEqual(jsClient.getSpec(), this.spec);
});
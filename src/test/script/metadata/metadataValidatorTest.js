/*
 * Copyright 2015, 2016 Olov McKie
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
	coraTest.metadataValidatorFactory = function(metadataProvider, pubSub) {
		var factor = function(metadataId, data) {

			var spec = {
				"metadataId" : metadataId,
				"data" : data,
				"metadataProvider" : metadataProvider,
				"pubSub" : pubSub
			};
			var validationResult = CORA.metadataValidator(spec).validate();
			return {
				validationResult : validationResult,
				metadataProvider : metadataProvider,
				pubSub : pubSub
			};

		};
		return Object.freeze({
			factor : factor
		});
	};

	return coraTest;
}(CORATEST || {}));

QUnit.module("metadataValidatorTest.js", {
	beforeEach : function() {
		var metadataProvider = new MetadataProviderStub();
		this.spec = {
			"metadataId" : "groupIdOneTextChild",
			"data" : undefined,
			"metadataProvider" : metadataProvider,
			"pubSub" : CORATEST.pubSubSpy()
		};

		this.metadataProvider = new MetadataProviderStub();
		this.pubSub = CORATEST.pubSubSpy();
		this.metadataValidatorFactory = CORATEST.metadataValidatorFactory(this.metadataProvider,
				this.pubSub);
	},
	afterEach : function() {
	}
});

QUnit.test("testInit", function(assert) {
	var metadataValidator = CORA.metadataValidator(this.spec);
	assert.strictEqual(metadataValidator.type, "metadataValidator");
});

QUnit.test("testGetSpec", function(assert) {
	var metadataValidator = CORA.metadataValidator(this.spec);
	assert.strictEqual(metadataValidator.getSpec(), this.spec);
});

QUnit.test("testValidateGroupIdOneTextChild1to1WithData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		}, ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneTextChild1to1WithDataEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdOneTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : ""
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"textVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId\"}]}}}');
});

QUnit.test("testValidateGroupIdOneCollectionChild1toXWithData", function(assert) {
	var data = {
		"name" : "groupId1toXCollectionChild",
		"children" : [ {
			"name" : "yesNoUnknownVar",
			"value" : "no"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupId1toXCollectionChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneCollectionChild1toXWithDataEmptyValue", function(assert) {
	var data = {
		"name" : "groupId1toXCollectionChild",
		"children" : [ {
			"name" : "yesNoUnknownVar",
			"value" : ""
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupId1toXCollectionChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"yesNoUnknownVar",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"yesNoUnknownVar\"}]}}}');
});

QUnit.test("testValidateGroupIdTwoTextChildWithData", function(assert) {
	var data = {
		"name" : "groupIdTwoTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		}, {
			"name" : "textVariableId2",
			"value" : "AValue2"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdTwoTextChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdTwoTextChildWithEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdTwoTextChild",
		"children" : [ {
			"name" : "textVariableId",
			"value" : ""
		}, {
			"name" : "textVariableId2",
			"value" : ""
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdTwoTextChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 2);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"textVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId\"}]}}}');
	assert.deepEqual(JSON.stringify(messages[1]), '{"type":"validationError","message":{'
			+ '"metadataId":"textVariableId2",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId2\"}]}}}');
});

QUnit.test("testValidategroupIdTwoTextChild1to1InGroupWithData", function(assert) {
	var data = {
		"name" : "groupIdTwoTextChild1to1InGroup",
		"children" : [ {
			"name" : "groupIdTwoTextChild",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value"
			}, {
				"name" : "textVariableId2",
				"value" : "AValue2"
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdTwoTextChild1to1InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidategroupIdTwoTextChild1to1InGroupWithEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdTwoTextChild1to1InGroup",
		"children" : [ {
			"name" : "groupIdTwoTextChild",
			"children" : [ {
				"name" : "textVariableId",
				"value" : ""
			}, {
				"name" : "textVariableId2",
				"value" : "AValue2"
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdTwoTextChild1to1InGroup", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	var validationError = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVariableId",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "groupIdTwoTextChild"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVariableId"
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);
});

QUnit.test("testValidateOneChildRepeat0to1WithData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat0to1", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateOneChildRepeat0to1WithEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : ""
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat0to1", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"remove","message":{'
			+ '"type":"remove",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId\"}]}}}');
});
QUnit.test("testValidateOneChildRepeat0to1NoData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : []
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat0to1", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

// textVarRepeat1to3InGroup
QUnit.test("testValidateTextVariableRepeat1to3InGroupWithData", function(assert) {
	var data = {
		"name" : "textVariableIdRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "one"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("textVariableIdRepeat1to3InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTextVariableRepeat1to3InGroupEmptyValue", function(assert) {
	var data = {
		"name" : "textVariableIdRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "",
			"repeatId" : "one"
		}, {
			"name" : "textVariableId",
			"value" : "",
			"repeatId" : "two"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("textVariableIdRepeat1to3InGroup", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 2);

	var validationError = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVariableId"
				}, {
					"name" : "repeatId",
					"value" : "two"
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);
	var validationError2 = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVariableId",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVariableId"
				}, {
					"name" : "repeatId",
					"value" : "one"
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[1], validationError2);
});

QUnit.test("testValidateOneChildRepeat3to3WithData", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "one"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "two"
		}, {
			"name" : "textVariableId",
			"value" : "A Value3",
			"repeatId" : "three"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat3to3", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateOneChildRepeat3to3WithEmptyValueForOne", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "one"
		}, {
			"name" : "textVariableId",
			"value" : "",
			"repeatId" : "two"
		}, {
			"name" : "textVariableId",
			"value" : "A Value3",
			"repeatId" : "three"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat3to3", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"textVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId\"}'
			+ ',{\"name\":\"repeatId\",\"value\":\"two\"}]}}}');

});

QUnit.test("testValidateOneChildRepeat1toXWithDataForOne", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "one"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat1toX", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateOneChildRepeat1toXWithDataForTwo", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value",
			"repeatId" : "one"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "two"
		} ]
	};
	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat1toX", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateOneChildRepeat1toXWithTwoWithDataForOne", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildRepeat0to1",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "",
			"repeatId" : "one"
		}, {
			"name" : "textVariableId",
			"value" : "A Value2",
			"repeatId" : "two"
		} ]
	};
	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildRepeat1toX", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"remove","message":{'
			+ '"type":"remove",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"textVariableId\"}'
			+ ',{\"name\":\"repeatId\",\"value\":\"one\"}]}}}');
});

QUnit.test("testValidateOneChildOneAttributeWithDataForOne", function(assert) {
	var data = {
		"name" : "groupIdOneTextChildOneAttribute",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		} ],
		"attributes" : {
			"anAttribute" : "aFinalValue"
		}
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneTextChildOneAttribute", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTextVarRepeat1to1InGroupOneAttributeInGroupWithData", function(assert) {
	var data = {
		"name" : "groupInGroupOneTextChildOneAttribute",
		"children" : [ {
			"name" : "groupIdOneTextChildOneAttribute",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value2"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor("groupInGroupOneTextChildOneAttribute",
			data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTextVarRepeat1to1InGroupOneAttributeInGroupWithEmptyValue",
		function(assert) {
			var data = {
				"name" : "groupInGroupOneTextChildOneAttribute",
				"children" : [ {
					"name" : "groupIdOneTextChildOneAttribute",
					"children" : [ {
						"name" : "textVariableId",
						"value" : ""
					} ],
					"attributes" : {
						"anAttribute" : "aFinalValue"
					}
				} ]
			};
			var factored = this.metadataValidatorFactory.factor(
					"groupInGroupOneTextChildOneAttribute", data);
			assert.notOk(factored.validationResult);
			var messages = this.pubSub.getMessages();
			assert.strictEqual(messages.length, 1);
			var validationError = {
				"type" : "validationError",
				"message" : {
					"metadataId" : "textVariableId",
					"path" : {
						"name" : "linkedPath",
						"children" : [ {
							"name" : "nameInData",
							"value" : "groupIdOneTextChildOneAttribute"
						}, {
							"name" : "attributes",
							"children" : [ {
								"name" : "attribute",
								"repeatId" : "1",
								"children" : [ {
									"name" : "attributeName",
									"value" : "anAttribute"
								}, {
									"name" : "attributeValue",
									"value" : "aFinalValue"
								} ]
							} ]
						}, {
							"name" : "linkedPath",
							"children" : [ {
								"name" : "nameInData",
								"value" : "textVariableId"
							} ]
						} ]
					}
				}
			};
			assert.stringifyEqual(messages[0], validationError);

		});

QUnit.test("testValidateTextVarRepeat1to1InGroupTwoAttributeInGroupWithData", function(assert) {
	var data = {
		"name" : "groupInGroupOneTextChildTwoAttributes",
		"children" : [ {
			"name" : "groupIdOneTextChildTwoAttributes",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value3"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue",
				"anOtherAttribute" : "aOtherFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor("groupInGroupOneTextChildTwoAttributes",
			data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTextVarRepeat1to1InGroupTwoAttributeInGroupWithEmptyValue",
		function(assert) {
			var data = {
				"name" : "groupInGroupOneTextChildTwoAttributes",
				"children" : [ {
					"name" : "groupIdOneTextChildTwoAttributes",
					"children" : [ {
						"name" : "textVariableId",
						"value" : ""
					} ],
					"attributes" : {
						"anAttribute" : "aFinalValue",
						"anOtherAttribute" : "aOtherFinalValue"
					}
				} ]
			};
			var factored = this.metadataValidatorFactory.factor(
					"groupInGroupOneTextChildTwoAttributes", data);
			assert.notOk(factored.validationResult);
			var messages = this.pubSub.getMessages();
			assert.strictEqual(messages.length, 1);
			var validationError = {
				"type" : "validationError",
				"message" : {
					"metadataId" : "textVariableId",
					"path" : {
						"name" : "linkedPath",
						"children" : [ {
							"name" : "nameInData",
							"value" : "groupIdOneTextChildTwoAttributes"
						}, {
							"name" : "attributes",
							"children" : [ {
								"name" : "attribute",
								"repeatId" : "1",
								"children" : [ {
									"name" : "attributeName",
									"value" : "anAttribute"
								}, {
									"name" : "attributeValue",
									"value" : "aFinalValue"
								} ]
							}, {
								"name" : "attribute",
								"repeatId" : "2",
								"children" : [ {
									"name" : "attributeName",
									"value" : "anOtherAttribute"
								}, {
									"name" : "attributeValue",
									"value" : "aOtherFinalValue"
								} ]
							} ]
						}, {
							"name" : "linkedPath",
							"children" : [ {
								"name" : "nameInData",
								"value" : "textVariableId"
							} ]
						} ]
					}
				}
			};
			assert.stringifyEqual(messages[0], validationError);
		});

QUnit.test("testValidateTextVarRepeat1to3InGroupOneAttribute"
		+ "Repeat0to2InGroupRepeat1to3InGroupWithData", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "AValue3",
					"repeatId" : "one2"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTextVarRepeat1to3InGroupOneAttribute"
		+ "Repeat0to2InGroupRepeat1to3InGroupWithEmptyValue", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "",
					"repeatId" : "one2"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup", data);

	assert.strictEqual(factored.validationResult, false);

	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 2);
	var validationError = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVarRepeat1to3InGroupOneAttribute"
					}, {
						"name" : "repeatId",
						"value" : "one1"
					}, {
						"name" : "attributes",
						"children" : [ {
							"name" : "attribute",
							"repeatId" : "1",
							"children" : [ {
								"name" : "attributeName",
								"value" : "anAttribute"
							}, {
								"name" : "attributeValue",
								"value" : "aFinalValue"
							} ]
						} ]
					}, {
						"name" : "linkedPath",
						"children" : [ {
							"name" : "nameInData",
							"value" : "textVar"
						}, {
							"name" : "repeatId",
							"value" : "one2"
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);

	var removeMessage = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVarRepeat1to3InGroupOneAttribute"
					}, {
						"name" : "repeatId",
						"value" : "one1"
					}, {
						"name" : "attributes",
						"children" : [ {
							"name" : "attribute",
							"repeatId" : "1",
							"children" : [ {
								"name" : "attributeName",
								"value" : "anAttribute"
							}, {
								"name" : "attributeValue",
								"value" : "aFinalValue"
							} ]
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[1], removeMessage);

});

QUnit.test("testInitTextVarRepeat1to3InGroupOneAttribute"
		+ "Repeat0to2InGroupRepeat1to3InGroupWithData2", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOne" + "AttributeRepeat0to2InGroupRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "AValue3",
					"repeatId" : "one2"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0_2",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "AValue3",
					"repeatId" : "one2"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testInitTextVarRepeat1to3InGroupOneAttribute"
		+ "Repeat0to2InGroupRepeat1to3InGroupWithEmptyValue", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOne" + "AttributeRepeat0to2InGroupRepeat1to3InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "",
					"repeatId" : "one2"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup",
			"repeatId" : "one0_2",
			"children" : [ {
				"name" : "textVarRepeat1to3InGroupOneAttribute",
				"repeatId" : "one1",
				"children" : [ {
					"name" : "textVar",
					"value" : "",
					"repeatId" : "one2"
				}, {
					"name" : "textVar",
					"value" : "AValue3",
					"repeatId" : "one3"
				} ],
				"attributes" : {
					"anAttribute" : "aFinalValue"
				}
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroupRepeat1to3InGroup", data);

	assert.ok(factored.validationResult);

	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 4);
	var validationError = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVarRepeat1to3InGroupOneAttribute"
					}, {
						"name" : "repeatId",
						"value" : "one1"
					}, {
						"name" : "attributes",
						"children" : [ {
							"name" : "attribute",
							"repeatId" : "1",
							"children" : [ {
								"name" : "attributeName",
								"value" : "anAttribute"
							}, {
								"name" : "attributeValue",
								"value" : "aFinalValue"
							} ]
						} ]
					}, {
						"name" : "linkedPath",
						"children" : [ {
							"name" : "nameInData",
							"value" : "textVar"
						}, {
							"name" : "repeatId",
							"value" : "one2"
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);

	var validationError2 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVarRepeat1to3InGroupOneAttribute"
					}, {
						"name" : "repeatId",
						"value" : "one1"
					}, {
						"name" : "attributes",
						"children" : [ {
							"name" : "attribute",
							"repeatId" : "1",
							"children" : [ {
								"name" : "attributeName",
								"value" : "anAttribute"
							}, {
								"name" : "attributeValue",
								"value" : "aFinalValue"
							} ]
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[1], validationError2);

	var validationError3 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0_2"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVarRepeat1to3InGroupOneAttribute"
					}, {
						"name" : "repeatId",
						"value" : "one1"
					}, {
						"name" : "attributes",
						"children" : [ {
							"name" : "attribute",
							"repeatId" : "1",
							"children" : [ {
								"name" : "attributeName",
								"value" : "anAttribute"
							}, {
								"name" : "attributeValue",
								"value" : "aFinalValue"
							} ]
						} ]
					}, {
						"name" : "linkedPath",
						"children" : [ {
							"name" : "nameInData",
							"value" : "textVar"
						}, {
							"name" : "repeatId",
							"value" : "one2"
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[2], validationError3);

	var validationError4 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttributeRepeat0to2InGroup"
				}, {
					"name" : "repeatId",
					"value" : "one0"
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[3], validationError4);
});

QUnit.test("testInitTextVarRepeat1to3InGroup"
		+ "OneAttributeAndOtherAttributeRepeat0to2InGroupWithData", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat0to2InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"repeatId" : "one1",
			"children" : [ {
				"name" : "textVar",
				"value" : "AValue3",
				"repeatId" : "one2"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue"
			}
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"repeatId" : "one1",
			"children" : [ {
				"name" : "textVar",
				"value" : "AValue33",
				"repeatId" : "one22"
			} ],
			"attributes" : {
				"anOtherAttribute" : "aOtherFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat0to2InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testInitTextVarRepeat1to3InGroup"
		+ "OneAttributeAndOtherAttributeRepeat0to2InGroupEmptyValue", function(assert) {
	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat0to2InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"repeatId" : "one1",
			"children" : [ {
				"name" : "textVar",
				"value" : "",
				"repeatId" : "one2"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue"
			}
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"repeatId" : "one1",
			"children" : [ {
				"name" : "textVar",
				"value" : "",
				"repeatId" : "one22"
			} ],
			"attributes" : {
				"anOtherAttribute" : "aOtherFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat0to2InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 4);
	var validationError = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "repeatId",
					"value" : "one1"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aFinalValue"
						} ]
					} ]
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVar"
					}, {
						"name" : "repeatId",
						"value" : "one2"
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);
	var validationError2 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "repeatId",
					"value" : "one1"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aFinalValue"
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[1], validationError2);

	var validationError3 = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "repeatId",
					"value" : "one1"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anOtherAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aOtherFinalValue"
						} ]
					} ]
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVar"
					}, {
						"name" : "repeatId",
						"value" : "one22"
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[2], validationError3);

	var validationError4 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "repeatId",
					"value" : "one1"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anOtherAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aOtherFinalValue"
						} ]
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[3], validationError4);
});

QUnit.test("testInitTextVarRepeat1to3InGroup"
		+ "OneAttributeAndOtherAttributeRepeat1to1InGroupWithData", function(assert) {

	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat0to2InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"children" : [ {
				"name" : "textVar",
				"value" : "AValue3",
				"repeatId" : "one2"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue"
			}
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"children" : [ {
				"name" : "textVar",
				"value" : "AValue33",
				"repeatId" : "one22"
			} ],
			"attributes" : {
				"anOtherAttribute" : "aOtherFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat1to1InGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testInitTextVarRepeat1to3InGroup"
		+ "OneAttributeAndOtherAttributeRepeat1to1InGroupEmptyValue", function(assert) {

	var data = {
		"name" : "textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat1to1InGroup",
		"children" : [ {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"children" : [ {
				"name" : "textVar",
				"value" : "",
				"repeatId" : "one2"
			} ],
			"attributes" : {
				"anAttribute" : "aFinalValue"
			}
		}, {
			"name" : "textVarRepeat1to3InGroupOneAttribute",
			"children" : [ {
				"name" : "textVar",
				"value" : "",
				"repeatId" : "one22"
			} ],
			"attributes" : {
				"anOtherAttribute" : "aOtherFinalValue"
			}
		} ]
	};
	var factored = this.metadataValidatorFactory.factor(
			"textVarRepeat1to3InGroupOneAttributeAndOtherAttributeRepeat1to1InGroup", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 2);
	var validationError = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aFinalValue"
						} ]
					} ]
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVar"
					}, {
						"name" : "repeatId",
						"value" : "one2"
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], validationError);

	var validationError2 = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "textVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "textVarRepeat1to3InGroupOneAttribute"
				}, {
					"name" : "attributes",
					"children" : [ {
						"name" : "attribute",
						"repeatId" : "1",
						"children" : [ {
							"name" : "attributeName",
							"value" : "anOtherAttribute"
						}, {
							"name" : "attributeValue",
							"value" : "aOtherFinalValue"
						} ]
					} ]
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "textVar"
					}, {
						"name" : "repeatId",
						"value" : "one22"
					} ]
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[1], validationError2);
});

QUnit.test("testValidateGroupIdOneRecordLinkWithData", function(assert) {
	var data = {
		"name" : "groupIdOneRecordLinkChild",
		"children" : [ {
			"name" : "myLink",
			"children" : [ {
				"name" : "linkedRecordType",
				"value" : "metadataTextVariable"
			}, {
				"name" : "linkedRecordId",
				"value" : "someInstance"
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneRecordLinkChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneRecordLinkWithDataEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdOneRecordLinkChild",
		"children" : [ {
			"name" : "myLink",
			"children" : [ {
				"name" : "linkedRecordType",
				"value" : "metadataTextVariable"
			}, {
				"name" : "linkedRecordId",
				"value" : ""
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneRecordLinkChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);

	var expectedMessage = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "linkedRecordIdTextVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [

				{
					"name" : "nameInData",
					"value" : "myLink"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "linkedRecordId"
					} ]
				} ]
			}
		}
	};

	assert.stringifyEqual(messages[0], expectedMessage);
});

// "groupId0to1RecordLinkChild"
QUnit.test("testValidateGroupId0to1RecordLinkWithDataEmptyValue", function(assert) {
	var data = {
		"name" : "groupId0to1RecordLinkChild",
		"children" : [ {
			"name" : "myLink",
			"children" : [ {
				"name" : "linkedRecordType",
				"value" : "metadataTextVariable"
			}, {
				"name" : "linkedRecordId",
				"value" : ""
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupId0to1RecordLinkChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 2);

	var expectedMessage = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "linkedRecordIdTextVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [

				{
					"name" : "nameInData",
					"value" : "myLink"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "linkedRecordId"
					} ]
				} ]
			}
		}
	};
	var expectedMessage2 = {
		"type" : "remove",
		"message" : {
			"type" : "remove",
			"path" : {
				"name" : "linkedPath",
				"children" : [

				{
					"name" : "nameInData",
					"value" : "myLink"
				} ]
			}
		}
	};
	assert.stringifyEqual(messages[0], expectedMessage);
	assert.stringifyEqual(messages[1], expectedMessage2);
});

// groupIdOneRecordLinkChildWithPath
QUnit.test("testValidateGroupIdOneRecordLinkChildWithPathWithData", function(assert) {
	var data = {
		"name" : "groupIdOneRecordLinkChildWithPath",
		"children" : [ {
			"name" : "myPathLink",
			"children" : [ {
				"name" : "linkedRecordType",
				"value" : "metadataTextVariable"
			}, {
				"name" : "linkedRecordId",
				"value" : "someInstance"
			}, {
				"name" : "linkedRepeatId",
				"value" : "one"
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneRecordLinkChildWithPath", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneRecordLinkChildWithPathWithDataEmptyValue", function(assert) {
	var data = {
		"name" : "groupIdOneRecordLinkChildWithPath",
		"children" : [ {
			"name" : "myPathLink",
			"children" : [ {
				"name" : "linkedRecordType",
				"value" : "metadataTextVariable"
			}, {
				"name" : "linkedRecordId",
				"value" : "someInstance"
			}, {
				"name" : "linkedRepeatId",
				"value" : ""
			} ]
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneRecordLinkChildWithPath", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);

	var expectedMessage = {
		"type" : "validationError",
		"message" : {
			"metadataId" : "linkedRepeatIdTextVar",
			"path" : {
				"name" : "linkedPath",
				"children" : [ {
					"name" : "nameInData",
					"value" : "myPathLink"
				}, {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
						"value" : "linkedRepeatId"
					} ]
				} ]
			}
		}
	};

	assert.stringifyEqual(messages[0], expectedMessage);
});
QUnit.test("testValidateGroupIdOneNumberChild1to1WithData", function(assert) {
	var data = {
		"name" : "groupIdOneNumberChild",
		"children" : [ {
			"name" : "numVariableId",
			"value" : "4"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneNumberChild1to1WithEmptyValue", function(assert) {
    var data = {
        "name" : "groupIdOneNumberChild",
        "children" : [ {
            "name" : "numVariableId",
            "value" : ""
        } ]
    };

    var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
    assert.notOk(factored.validationResult);
    var messages = this.pubSub.getMessages();
    assert.strictEqual(messages.length, 1);
});


QUnit.test("testValidateGroupIdOneNumberChild0to1WithDataEmptyValue", function(assert) {
	var data = {
			"name" : "groupIdOneNumberNotMandatoryChild",
			"children" : [ {
				"name" : "numVariableId",
				"value" : ""
			} ]
	};
	
	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberNotMandatoryChild", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);

    assert.deepEqual(JSON.stringify(messages[0]), '{"type":"remove","message":{'
        + '"type":"remove",' + '"path":{\"name\":\"linkedPath\"'
        + ',\"children\":[{\"name\":\"nameInData\",\"value\":\"numVariableId\"}]}}}');
});

QUnit.test("testValidateGroupIdOneNumberChild1to1WithDataNotANumber", function(assert) {
	var data = {
		"name" : "groupIdOneNumberChild",
		"children" : [ {
			"name" : "numVariableId",
			"value" : "Not a number"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"numVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"numVariableId\"}]}}}');
});

QUnit.test("testValidateGroupIdOneNumberChild1to1WithDataMaxAboveAllowed", function(assert) {
	var data = {
		"name" : "groupIdOneNumberChild",
		"children" : [ {
			"name" : "numVariableId",
			"value" : "200"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"numVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"numVariableId\"}]}}}');
});

QUnit.test("testValidateGroupIdOneNumberChild1to1WithDataMinBelowAllowed", function(assert) {
	var data = {
		"name" : "groupIdOneNumberChild",
		"children" : [ {
			"name" : "numVariableId",
			"value" : "-1"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"numVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"numVariableId\"}]}}}');
});

QUnit.test("testValidateGroupIdOneNumberChild1to1WithDataMoreDecimalsThanAllowed", function(assert) {
	var data = {
		"name" : "groupIdOneNumberChild",
		"children" : [ {
			"name" : "numVariableId",
			"value" : "1.567"
		} ]
	};

	var factored = this.metadataValidatorFactory.factor("groupIdOneNumberChild", data);
	assert.notOk(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	assert.deepEqual(JSON.stringify(messages[0]), '{"type":"validationError","message":{'
			+ '"metadataId":"numVariableId",' + '"path":{\"name\":\"linkedPath\"'
			+ ',\"children\":[{\"name\":\"nameInData\",\"value\":\"numVariableId\"}]}}}');
});


QUnit.test("testValidateGroupIdOneTextChild1to1OneCollectionChildWithFinalValueWithData", function(assert) {
	var data = {
		"name" : "groupWithOneCollectionVarChildAndOneTextChildGroup",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		},
		{
			"name" : "trueFalse",
			"value" : "true"
		}]
	};

	var factored = this.metadataValidatorFactory.factor("groupWithOneCollectionVarChildAndOneTextChildGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdOneTextChild1to1OneCollectionChildWithFinalValueWithIncorrectFinalValue", function(assert) {
	var data = {
		"name" : "groupWithOneCollectionVarChildAndOneTextChildGroup",
		"children" : [ {
			"name" : "textVariableId",
			"value" : "A Value"
		},
		{
			"name" : "trueFalse",
			"value" : "false"
		}]
	};

	var factored = this.metadataValidatorFactory.factor("groupWithOneCollectionVarChildAndOneTextChildGroup", data);
	assert.notOk(factored.validationResult);
	
	var messages = this.pubSub.getMessages();
	assert.strictEqual(messages.length, 1);
	var expectedMessage = {
			"type" : "validationError",
			"message" : {
				"metadataId" : "trueFalseTrueIsFinalValueCollectionVar",
				"path" : {
					"name" : "linkedPath",
					"children" : [ {
						"name" : "nameInData",
							"value" : "trueFalse"
						} ]
					
				}
			}
		};

		assert.stringifyEqual(messages[0], expectedMessage);
});

QUnit.test("testValidateGroupInGroupIdOneTextChild0to1OneCollectionChildWithFinalValueWithData", function(assert) {
	var data = {
			"name" : "groupWithOneGroupWithCollectionVarChildAndOneTextChildNonMandatoryGroup",
			"children" : [ {
				"name" : "groupWithOneCollectionVarChildAndOneTextChildGroup",
				"children" : [ {
					"name" : "textVariableId",
					"value" : ""
				}, {
					"name" : "trueFalse",
					"value" : "true"
				} ]
			} ]
		};

	var factored = this.metadataValidatorFactory.factor("groupWithOneGroupWithCollectionVarChildAndOneTextChildNonMandatoryGroup", data);
	assert.ok(factored.validationResult);
	var messages = this.pubSub.getMessages();
	var validationError = {
			  "type": "validationError",
			  "message": {
			    "metadataId": "textVariableId",
			    "path": {
			      "name": "linkedPath",
			      "children": [
			        {
			          "name": "nameInData",
			          "value": "groupWithOneCollectionVarChildAndOneTextChildGroup"
			        },
			        {
			          "name": "linkedPath",
			          "children": [
			            {
			              "name": "nameInData",
			              "value": "textVariableId"
			            }]
			        }]
			    }}
			};
		assert.stringifyEqual(messages[0], validationError);
		var removeMessage = {
				  "type": "remove",
				  "message": {
				    "type": "remove",
				    "path": {
				      "name": "linkedPath",
				      "children": [
				        {
				          "name": "nameInData",
				          "value": "groupWithOneCollectionVarChildAndOneTextChildGroup"
				        }
				      ]
				    }
				  }
				};
		assert.stringifyEqual(messages[1], removeMessage);
	
	assert.strictEqual(messages.length, 2);
});

QUnit.test("testValidateTwoChildrenOneWithConstraintsNoValueNOWritePermission", function(assert) {
	var data = {
			"name" : "groupIdTwoTextChildrenOneWritePermission",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value"
			},{
				"name" : "numVariableId",
				"value" : "" 
			}]
	};
	var specForPermission = {
			"metadataId" : "groupIdTwoTextChildrenOneWritePermission",
			"data" : data,
			"metadataProvider" : this.metadataProvider,
			"pubSub" : CORATEST.pubSubSpy(),
			"writePermissions" : []
		};
	var metadataValidator = CORA.metadataValidator(specForPermission);
	var validationResult = metadataValidator.validate();
	assert.ok(validationResult);
//	var messages = this.pubSub.getMessages();
//	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateTwoChildrenOneWithConstraintsNoValueHasWritePermission", function(assert) {
	var data = {
			"name" : "groupIdTwoTextChildrenOneWritePermission",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value"
			},{
				"name" : "numVariableId",
				"value" : "" 
			}]
	};
	var specForPermission = {
			"metadataId" : "groupIdTwoTextChildrenOneWritePermission",
			"data" : data,
			"metadataProvider" : this.metadataProvider,
			"pubSub" : CORATEST.pubSubSpy(),
			"writePermissions" : ["numVariableId"]
		};
	var metadataValidator = CORA.metadataValidator(specForPermission);
	var validationResult = metadataValidator.validate();
	assert.notOk(validationResult);
//	var messages = this.pubSub.getMessages();
//	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdTwoTextChildrenOneWithConstraintsHasWritePermission", function(assert) {
	var data = {
			"name" : "groupIdTwoTextChildrenOneWritePermission",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value"
			},{
				"name" : "numVariableId",
				"value" : "4" 
			}]
	};
	var specForPermission = {
			"metadataId" : "groupIdTwoTextChildrenOneWritePermission",
			"data" : data,
			"metadataProvider" : this.metadataProvider,
			"pubSub" : CORATEST.pubSubSpy(),
			"writePermissions" : ["numVariableId"]
		};
	var metadataValidator = CORA.metadataValidator(specForPermission);
	var validationResult = metadataValidator.validate();
	assert.ok(validationResult);
//	var messages = this.pubSub.getMessages();
//	assert.strictEqual(messages.length, 0);
});

QUnit.test("testValidateGroupIdTwoTextChildrenOneWithConstraintsHasValueNOWritePermission", function(assert) {
	var data = {
			"name" : "groupIdTwoTextChildrenOneWritePermission",
			"children" : [ {
				"name" : "textVariableId",
				"value" : "A Value"
			},{
				"name" : "numVariableId",
				"value" : "4" 
			}]
	};
	var specForPermission = {
			"metadataId" : "groupIdTwoTextChildrenOneWritePermission",
			"data" : data,
			"metadataProvider" : this.metadataProvider,
			"pubSub" : CORATEST.pubSubSpy(),
			"writePermissions" : ["NOTnumVariableId"]
		};
	var metadataValidator = CORA.metadataValidator(specForPermission);
	var validationResult = metadataValidator.validate();
	assert.ok(validationResult);
//	var messages = this.pubSub.getMessages();
//	assert.strictEqual(messages.length, 0);
});


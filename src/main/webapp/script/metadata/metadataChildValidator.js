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

var CORA = (function(cora) {
	"use strict";
	cora.metadataChildValidator = function(childReferenceIn, path, dataIn, metadataProvider, pubSub) {
		var result = {
			"everythingOkBelow" : true,
			"containsValuableData" : false
		};
		var childReference = CORA.coraData(childReferenceIn);
		var cData = CORA.coraData(dataIn);

		var cRef = CORA.coraData(childReference.getFirstChildByNameInData("ref"));
		var ref = cRef.getFirstAtomicValueByNameInData("linkedRecordId");
		var nameInData = getNameInDataForMetadataId(ref);
		var attributes = getAttributesForMetadataId(ref);
		var dataChildrenForMetadata = getDataChildrenForMetadata(nameInData, attributes);
		var noOfRepeatsForThisChild = calculateMinRepeat();
		var childInstancesCanNotBeRemoved = [];
		var childInstancesCanBeRemoved = [];
		var numberOfChildrenOk = 0;

		validateAndCategorizeChildInstances();

		function getNameInDataForMetadataId(refIn) {
			var metadataElement = getMetadataById(refIn);
			return metadataElement.getFirstAtomicValueByNameInData("nameInData");
		}

		function getAttributesForMetadataId(refIn) {
			var metadataElement = getMetadataById(refIn);
			if (metadataElement.containsChildWithNameInData("attributeReferences")) {
				return getAttributesForMetadataElement(metadataElement);
			}
			return undefined;
		}

		function getAttributesForMetadataElement(metadataElement) {
			var attributesOut = createAttributes();
			var attributeReferences = metadataElement
					.getFirstChildByNameInData("attributeReferences");
			var attributeReference;
			for (var i = 0; i < attributeReferences.children.length; i++) {
				attributeReference = attributeReferences.children[i];
				var attribute = getAttributeForAttributeReference(attributeReference, i);
				attributesOut.children.push(attribute);
			}
			return attributesOut;
		}

		function createAttributes() {
			return {
				"name" : "attributes",
				"children" : []
			};
		}

		function getAttributeForAttributeReference(attributeReference, index) {
			var attributeRef = getRefValueFromAttributeRef(attributeReference);
			var attributeMetadata = getMetadataById(attributeRef);
			var attributeNameInData = attributeMetadata
					.getFirstAtomicValueByNameInData("nameInData");
			var finalValue = attributeMetadata.getFirstAtomicValueByNameInData("finalValue");
			return createAttributeWithNameAndValueAndRepeatId(attributeNameInData, finalValue,
					index);
		}

		function getRefValueFromAttributeRef(attributeReference) {
			var cAttributeReference = CORA.coraData(attributeReference);
			return cAttributeReference.getFirstAtomicValueByNameInData("linkedRecordId");
		}

		function createAttributeWithNameAndValueAndRepeatId(attributeName, attributeValue, repeatId) {
			return {
				"name" : "attribute",
				"repeatId" : repeatId || "1",
				"children" : [ {
					"name" : "attributeName",
					"value" : attributeName
				}, {
					"name" : "attributeValue",
					"value" : attributeValue
				} ]
			};
		}

		function getDataChildrenForMetadata(nameInDataIn, attributesIn) {
			if (!cData.containsChildWithNameInDataAndAttributes(nameInDataIn, attributesIn)) {
				return [];
			}
			var dataChildrenForMetadataOut = cData.getChildrenByNameInDataAndAttributes(
					nameInDataIn, attributesIn);
			return dataChildrenForMetadataOut;
		}

		function validateAndCategorizeChildInstances() {
			for (var index = 0; index < noOfRepeatsForThisChild; index++) {
				validateAndCategorizeChildInstance(index);
			}
			removeEmptyChildren();
			setEverythingOkBelowInResult();
			sendValidationErrors();
		}

		function validateAndCategorizeChildInstance(index) {
			var childInstanceValidationResult = validateRepeatingChildInstanceWithData(index);
			setValuableDataInResult(childInstanceValidationResult);
			updateNumberOfChildrenOk(childInstanceValidationResult);
			categorizeChildInstance(childInstanceValidationResult);
		}

		function setValuableDataInResult(childInstanceValidationResult) {
			if (childInstanceValidationResult.containsValuableData) {
				result.containsValuableData = true;
			}
		}

		function updateNumberOfChildrenOk(childInstanceValidationResult) {
			if (childInstanceValidationResult.everythingOkBelow) {
				numberOfChildrenOk++;
			}
		}

		function categorizeChildInstance(childInstanceValidationResult) {
			if (!childInstanceValidationResult.everythingOkBelow) {
				categorizeInvalidChildInstance(childInstanceValidationResult);
			}
		}

		function categorizeInvalidChildInstance(childInstanceValidationResult) {
			if (childInstanceValidationResult.containsValuableData) {
				childInstancesCanNotBeRemoved.push(childInstanceValidationResult);
				result.everythingOkBelow = false;
			} else {
				childInstancesCanBeRemoved.push(childInstanceValidationResult);
			}
		}

		function calculateNeededNoChildrenForRepeatMin(childrenNotRemovable) {
			var repeatMin = Number(childReference.getFirstAtomicValueByNameInData("repeatMin"));
			return repeatMin - childrenNotRemovable;
		}

		function sendRemoveForEmptyChildren(childrenCanBeRemoved, noChildrenNeededForRepeatMin) {
			if (allEmptyChildrenCanBeRemoved(noChildrenNeededForRepeatMin)) {
				removeAllEmptyChildren(childrenCanBeRemoved);
			} else {
				removeExceedingEmptyChildren(childrenCanBeRemoved, noChildrenNeededForRepeatMin);
			}
		}

		function removeEmptyChildren() {
			var childrenNotRemovable = numberOfChildrenOk + childInstancesCanNotBeRemoved.length;
			var noChildrenNeededForRepeatMin = calculateNeededNoChildrenForRepeatMin(childrenNotRemovable);
			sendRemoveForEmptyChildren(childInstancesCanBeRemoved, noChildrenNeededForRepeatMin);
		}

		function setEverythingOkBelowInResult() {
			if (childInstancesCanBeRemoved.length > 0) {
				result.everythingOkBelow = false;
			}
		}

		function sendValidationErrors() {
			sendValidationErrorToEmptyChildren(childInstancesCanNotBeRemoved);
			sendValidationErrorToEmptyChildren(childInstancesCanBeRemoved);
		}

		function allEmptyChildrenCanBeRemoved(noChildrenNeededForRepeatMin) {
			return noChildrenNeededForRepeatMin < 1;
		}

		function removeAllEmptyChildren(childrenCanBeRemoved) {
			childrenCanBeRemoved.forEach(function(errorMessage) {
				sendRemoveForEmptyChild(errorMessage);
				childrenCanBeRemoved.shift();
			});
		}

		function removeExceedingEmptyChildren(childrenCanBeRemoved, noChildrenNeededForRepeatMin) {
			var noToRemove = childrenCanBeRemoved.length - noChildrenNeededForRepeatMin;
			for (var i = 0; i < noToRemove; i++) {
				sendRemoveForEmptyChild(childrenCanBeRemoved.pop());
			}
		}

		function sendRemoveForEmptyChild(errorMessage) {
			var removeMessage = {
				"type" : "remove",
				"path" : errorMessage.validationMessage.path
			};
			pubSub.publish("remove", removeMessage);
		}

		function sendValidationErrorToEmptyChildren(childValidationResults) {
			childValidationResults.forEach(function(errorMessage) {
				if (errorMessage.sendValidationMessages) {
					sendValidationErrorToEmptyChild(errorMessage.validationMessage);
				}
			});
		}

		function sendValidationErrorToEmptyChild(errorMessage) {
			pubSub.publish("validationError", errorMessage);
		}

		function calculateMinRepeat() {
			var repeatMin = childReference.getFirstAtomicValueByNameInData("repeatMin");
			var noOfData = dataChildrenForMetadata.length;
			if (noOfData > repeatMin) {
				repeatMin = noOfData;
			}
			return repeatMin;
		}

		function validateRepeatingChildInstanceWithData(index) {
			var dataChild = dataChildrenForMetadata[index];
			var repeatId = dataChild.repeatId;
			return validateForMetadataWithIdAndDataAndRepeatId(dataChild, repeatId);
		}

		function getMetadataById(id) {
			return CORA.coraData(metadataProvider.getMetadataById(id));
		}

		function validateForMetadataWithIdAndDataAndRepeatId(dataChild, repeatId) {
			return CORA.metadataRepeatValidator(ref, path, dataChild, repeatId, metadataProvider,
					pubSub);
		}

		return result;
	};
	return cora;
}(CORA));
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

var CORA = (function(cora) {
	"use strict";
	cora.metadataValidator = function(spec) {
		var topLevelMetadataId = spec.metadataId;
		var topLevelData = spec.data;

		function validateFirstLevel() {
			var childrenResult = true;
			var topLevelMetadataElement = getMetadataById(topLevelMetadataId);
			var topLevelChildReferences = topLevelMetadataElement
					.getFirstChildByNameInData('childReferences');
			var topLevelPath = {};
			topLevelChildReferences.children.forEach(function(childReference) {
				if(validationShouldBeIgnored(childReference)){
					return true;
				}
				var childResult = CORA.metadataChildValidator(childReference, topLevelPath,
						topLevelData, spec.metadataProvider, spec.pubSub);
				if (!childResult.everythingOkBelow) {
					childrenResult = false;
				}
			});
			return childrenResult;
		}
		
		const validationShouldBeIgnored = function(childReference){
			let cChild = CORA.coraData(childReference);
			if(cChild.containsChildWithNameInData("recordPartConstraint")){
				let shouldBeValidated = permissionExistsForChild(cChild);
				if(!shouldBeValidated){
					return true;
				}
			}
			return false;
		}
		
		const permissionExistsForChild = function(cChild){
			return spec.writePermissions !== undefined && 
				userHasPermission(cChild);
		}
		
		const userHasPermission = function(cChild){
			let nameInData = getNameInData(cChild);
			let writePermissions = spec.writePermissions;
			for(var i=0; i<writePermissions.length; i++){
				if(writePermissions[i] === nameInData){
					return true;
				}
			}
			return false;
		}
		
		const getNameInData = function(cChild){
			let cRef = CORA.coraData(cChild.getFirstChildByNameInData("ref"));
			let ref = cRef.getFirstAtomicValueByNameInData("linkedRecordId");
			return getNameInDataForMetadataId(ref);
		
		}
		
		function getNameInDataForMetadataId(refIn) {
			var metadataElement = getMetadataById(refIn);
			return metadataElement.getFirstAtomicValueByNameInData("nameInData");
		}

		function getMetadataById(id) {
			return CORA.coraData(spec.metadataProvider.getMetadataById(id));
		}

		function getSpec() {
			return spec;
		}

		var out = Object.freeze({
			"type" : "metadataValidator",
			validate : validateFirstLevel,
			getSpec : getSpec
		});
		return out;
	};
	return cora;
}(CORA));
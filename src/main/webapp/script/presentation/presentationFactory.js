/*
 * Copyright 2016, 2017 Olov McKie
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
	cora.presentationFactory = function(dependencies) {
		var self;

		function factor(path, metadataIdUsedInData, cPresentation, cParentPresentation) {

			var infoFactory = CORA.infoFactory();

			var pVarViewFactoryDependencies = {
				"infoFactory" : infoFactory
			};
			var pRepeatingElementFactoryDependencies = {
				"infoFactory" : infoFactory,
				"jsBookkeeper" : dependencies.jsBookkeeper
			};

			var pVarViewFactory = CORA.pVarViewFactory(pVarViewFactoryDependencies);
			var pRecordLinkViewFactoryDependencies = {
				"infoFactory" : CORA.infoFactory()
			};
			var pRecordLinkViewFactory = CORA
					.pRecordLinkViewFactory(pRecordLinkViewFactoryDependencies);
			var pChildRefHandlerFactoryDependencies = {
				"metadataProvider" : dependencies.providers.metadataProvider,
				"pubSub" : dependencies.pubSub,
				"textProvider" : dependencies.providers.textProvider,
				"presentationFactory" : self,
				"jsBookkeeper" : dependencies.jsBookkeeper,
				"recordTypeProvider" : dependencies.providers.recordTypeProvider,
				"uploadManager" : dependencies.uploadManager,
				"ajaxCallFactory" : dependencies.ajaxCallFactory,
				"pRepeatingElementFactory" : CORA
						.pRepeatingElementFactory(pRepeatingElementFactoryDependencies),
				"pChildRefHandlerViewFactory" : CORA.pChildRefHandlerViewFactory()
			};

			var pChildRefHandlerFactory = CORA
					.pChildRefHandlerFactory(pChildRefHandlerFactoryDependencies);

			var childDependencies = {
				"providers" : dependencies.providers,
				"globalFactories" : dependencies.globalFactories,
				"clientInstanceProvider" : dependencies.providers.clientInstanceProvider,
				"metadataProvider" : dependencies.providers.metadataProvider,
				"pubSub" : dependencies.pubSub,
				"textProvider" : dependencies.providers.textProvider,
				"jsBookkeeper" : dependencies.jsBookkeeper,
				"presentationFactory" : self,
				"xmlHttpRequestFactory" : dependencies.xmlHttpRequestFactory,
				"recordGuiFactory" : dependencies.recordGuiFactory,
				"recordTypeProvider" : dependencies.providers.recordTypeProvider,
				"uploadManager" : dependencies.uploadManager,
				"ajaxCallFactory" : dependencies.ajaxCallFactory,
				"pVarViewFactory" : pVarViewFactory,
				"pRecordLinkViewFactory" : pRecordLinkViewFactory,
				"pChildRefHandlerFactory" : pChildRefHandlerFactory,
				"authTokenHolder" : dependencies.authTokenHolder
			};
			var specNew = {
				"path" : path,
				"metadataIdUsedInData" : metadataIdUsedInData,
				"cPresentation" : cPresentation,
				"cParentPresentation" : cParentPresentation
			};

			var type = cPresentation.getData().attributes.type;
			if (type === "pVar") {
				return CORA.pVar(childDependencies, specNew);
			} else if (type === "pGroup") {
				return CORA.pGroup(childDependencies, specNew);
			} else if (type === "pRecordLink") {
				return CORA.pRecordLink(childDependencies, specNew);
			} else if (type === "pCollVar") {
				return CORA.pCollectionVar(childDependencies, specNew);
			} else if (type === "pResourceLink") {
				return CORA.pResourceLink(childDependencies, specNew);
			} else {
				var repeat = cPresentation.getData().attributes.repeat;
				if (repeat === "this") {
					return CORA.pRepeatingContainer(childDependencies, specNew);
				}
				return CORA.pSurroundingContainer(childDependencies, specNew);
			}
		}

		function getDataDivider() {
			return dependencies.dataDivider;
		}

		function getDependencies() {
			return dependencies;
		}

		var out = Object.freeze({
			"type" : "presentationFactory",
			getDependencies : getDependencies,
			getDataDivider : getDataDivider,
			factor : factor
		});
		self = out;
		return out;

	};
	return cora;
}(CORA));
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
var CORA = (function(cora) {
	"use strict";
	cora.loginManager = function(dependencies, spec) {
		var out;
		var loginManagerView;
		var authInfo;

		function start() {

			var loginOptions = [ {
				"text" : "appToken as 141414",
				"call" : appTokenLogin
			}, {
				"text" : "Uppsala webredirect",
				"call" : webRedirectLogin
			} ];
			var viewSpec = {
				"loginOptions" : loginOptions,
				"logoutMethod" : logout
			};
			loginManagerView = dependencies.loginManagerViewFactory.factor(viewSpec);
		}
		function appTokenLogin() {
			var appTokenLoginFactorySpec = {
				"requestMethod" : "POST",
				"url" : spec.appTokenBaseUrl + "apptokenverifier/rest/apptoken/",
				"accept" : "",
				"authInfoCallback" : appTokenAuthInfoCallback,
				"errorCallback" : appTokenErrorCallback,
				"timeoutCallback" : appTokenTimeoutCallback
			};
			var factoredAppTokenLogin = dependencies.appTokenLoginFactory
					.factor(appTokenLoginFactorySpec);
			factoredAppTokenLogin.login("141414", "63e6bd34-02a1-4c82-8001-158c104cae0e");
		}

		function webRedirectLogin() {
			// TODO: create a webRedirectLoginFactory that creates a webRedirectLogin(and sends in
			// window) for easyer testing
			window.open("webRedirectLogin.html", "webRedirectLogin");
		}

		function getDependencies() {
			return dependencies;
		}

		function getHtml() {
			return loginManagerView.getHtml();
		}

		function appTokenAuthInfoCallback(authInfoIn) {
			authInfo = authInfoIn;
			dependencies.authTokenHolder.setCurrentAuthToken(authInfo.token);
			loginManagerView.setUserId(authInfo.userId);
			loginManagerView.setState(CORA.loginManager.LOGGEDIN);
			spec.afterLoginMethod();
		}
		function appTokenErrorCallback() {
			spec.setErrorMessage("AppToken login failed!");
		}
		function appTokenTimeoutCallback() {
			spec.setErrorMessage("AppToken login timedout!");
		}

		function logout() {
			var deleteLink = authInfo.actionLinks['delete'];
			var callSpec = {
				"requestMethod" : deleteLink.requestMethod,
				"url" : deleteLink.url,
				"loadMethod" : logoutCallback,
				"errorMethod" : appTokenErrorCallback,
				"timeoutMethod" : appTokenTimeoutCallback,
				"data" : authInfo.token,
				"timeoutInMS" : 15000
			};
			dependencies.ajaxCallFactory.factor(callSpec);
		}

		function logoutCallback() {
			loginManagerView.setState(CORA.loginManager.LOGGEDOUT);
			dependencies.authTokenHolder.setCurrentAuthToken("");
			spec.afterLogoutMethod();
		}

		function getSpec() {
			// needed for test
			return spec;
		}

		out = Object.freeze({
			"type" : "loginManager",
			getDependencies : getDependencies,
			getHtml : getHtml,
			appTokenLogin : appTokenLogin,
			webRedirectLogin : webRedirectLogin,
			logout : logout,
			appTokenAuthInfoCallback : appTokenAuthInfoCallback,
			appTokenErrorCallback : appTokenErrorCallback,
			appTokenTimeoutCallback : appTokenTimeoutCallback,
			logoutCallback : logoutCallback,
			getSpec : getSpec
		});
		start();
		return out;
	};
	cora.loginManager.LOGGEDOUT = 0;
	cora.loginManager.LOGGEDIN = 1;
	return cora;
}(CORA));
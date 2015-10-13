
const cookieRegexTriggeringClearHistory = /^forceBrowserExit$/;
const urlRegexTriggeringClearHistory = ''; // /^https:\/\/cas.univ-paris1.fr\/cas\/logout/;

let {Cc, Ci} = require("chrome");
let cookieManager = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager);
var browserHistory = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsIBrowserHistory);
let observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);


function clearHistory() {
    cookieManager.removeAll();
    browserHistory.removeAllPages();
}

if (urlRegexTriggeringClearHistory) {
    let obs = {
	observe: function (aSubject, aTopic, aData) {
            let httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
            let requestUrl = httpChannel.URI.spec;
	    if (requestUrl.match(urlRegexTriggeringClearHistory)) {
		console.info('clearing history&cookies since url is ' + requestUrl);
		clearHistory();
	    }
	},
	reg: function () {
            observerService.addObserver(obs, 'http-on-modify-request', false);
	},
	unreg: function () {
            observerService.removeObserver(obs, 'http-on-modify-request');
	}
    };
    obs.reg();
}

if (cookieRegexTriggeringClearHistory) {
    let obs = {
	observe: function (aSubject, aTopic, aData) {
	    if (aData === "added") {
		let cookie = aSubject.QueryInterface(Ci.nsICookie2);
		if (cookie.name.match(cookieRegexTriggeringClearHistory)) {
		    console.info('clearing history&cookies since cookie is ' + cookie.name);
		    clearHistory();
		}
	    }
	},
	reg: function () {
            observerService.addObserver(obs, 'cookie-changed', false);
	},
	unreg: function () {
            observerService.removeObserver(obs, 'cookie-changed');
	}
    };
    obs.reg();
}

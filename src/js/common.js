//Constants
var NOT_AVAILABLE = "Not available";
var NO_HISTORY = "No history available";

var HISTORY_MAX = 5;

var monthNames = [ "January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December" ];

var chromeAPI = {
    storage: chrome.storage.local,
    alarms: chrome.alarms,
    runtime: chrome.runtime,
    tabs: chrome.tabs,
    browser: chrome.browserAction,
    notifications: chrome.notifications,
    menu: chrome.contextMenus,
    extension: chrome.extension
}

var common = {

    isNetworkAvailable: function (callbackHandler) {
        if (!callbackHandler.error) {
            callbackHandler.error = function () {
            };
        }

        $.ajax({url: "http://google.com",
                   success: function () {
                       callbackHandler.success();
                   },
                   error: function () {
                       callbackHandler.error();
                   }});
    },

    checkUrl: function (rule, callbackHandler) {
        $.ajax({url: rule.url,
                   success: function (srcHtml) {
                       var foundData = $(srcHtml).find(rule.selector);
                       if (foundData.length != 0) {
                           var newVal = foundData.first().text().trim();
                           callbackHandler(newVal);
                       } else {
                           callbackHandler("");
                       }

                   },
                   error: function () {
                       callbackHandler("");
                   }});
    },

    getFavicon: function (url) {
        return url.replace(/^((http|https):\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
    },

    formatDate: function (d) {
        var day = d.getUTCDay();
        var month = d.getUTCMonth();
        var year = d.getFullYear();

        var h = d.getHours();
        var m = d.getMinutes();

        return h + ":" + twoDigits(m) + " (" + day + " " + monthNames[month - 1].substr(0, 3) + " " + year + ")";
    }


};

function isEmpty(str) {
    return !str || str.trim().length == 0;
}

function twoDigits(d) {
    if (String(d).length < 2) {
        d = "0" + d;
    }
    return d;
}

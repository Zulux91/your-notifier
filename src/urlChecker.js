var storage = chrome.storage.local;
var NOT_AVAILABLE = "Not available";

function checkAndUpdate(rule) {
    $.ajax({url: rule.url,
               success: function (srcHtml) {
                   var foundData = $(srcHtml).find(rule.selector);

                   if (foundData.length != 0) {
                       var newVal = foundData.first().text().trim();
                       if (newVal) {
                           rule.value = newVal;
                           updateRuleValue(rule);
                       }
                   } else {
                       onError();
                   }

               },
               error: function () {
                   onError();
               }});

    function onError() {
        rule.value = NOT_AVAILABLE;
        updateRuleValue(rule);
    }
}

function updateRuleValue(rule) {
    storage.get('rules', function (data) {
        var rules = data.rules;
        var oldRule = _.find(rules, function (r) {
            return r.id == rule.id;
        });

        if (rule.value != NOT_AVAILABLE && oldRule.value != rule.value) {
            oldRule.value = rule.value;

            if (!oldRule.history) {
                oldRule.history = [];
            }

            oldRule.history.unshift({"value": oldRule.value, "date": new Date().getTime()});
        }

        storage.set({'rules': rules}, function () {
            refreshRuleControls();
        });
    });
}
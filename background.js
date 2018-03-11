function getLastHostnamePromise(callback) {
    return browser.storage.local.get("oldHostname");
}

function getPreviousTimestampPromise(lastHostname) {
    return browser.storage.local.get(lastHostname + "-stamp");
}

function getTimeSpentPromise(lastHostname) {
    return browser.storage.local.get(lastHostname + "-spent");
}

function setCurrentTimestamp(currentHostname, currentTimestamp) {
    let currentHostnameStamp = currentHostname + "-stamp";
    return browser.storage.local.set({
        [currentHostnameStamp] : currentTimestamp
    });
}

function setTimeSpent(lastHostname, timeSpent) {
    let currentHostnameSpent = lastHostname + "-spent";
    return browser.storage.local.set({
        [currentHostnameSpent] : timeSpent
    });
}

function setLastHostname(hostname) {
    return browser.storage.local.set({
        "oldHostname" : hostname
    });
}

function checkHostname(currentHostname) {
    getLastHostnamePromise().then(lastHostnameObj => {
        let lastHostname = lastHostnameObj.oldHostname;
        if (lastHostname === "") {
            lastHostname = "default";
        }
        console.log("old hostname " + lastHostname);
        if (lastHostname !== currentHostname) {
            let currentTimestamp = Date.now();
            getPreviousTimestampPromise(lastHostname).then(previousTimestampObj => {
                let previousTimestamp = previousTimestampObj[lastHostname + "-stamp"];
                if (previousTimestamp === undefined) {
                    previousTimestamp = Date.now();
                }
                console.log("previousTimestamp " + previousTimestamp);
                setCurrentTimestamp(currentHostname, currentTimestamp).then(() => {
                    let timeSpent = currentTimestamp - previousTimestamp;
                    console.log("timeSpent " + timeSpent);
                    getTimeSpentPromise(lastHostname).then(oldTimeSpentObj => {
                        let oldTimeSpent = oldTimeSpentObj[lastHostname + "-spent"];
                        if (isNaN(oldTimeSpent)) {
                            oldTimeSpent = 0;
                        }
                        console.log("oldTimeSpent " + oldTimeSpent);
                        setTimeSpent(lastHostname, oldTimeSpent + timeSpent).then(() => {
                            setLastHostname(currentHostname).then(() => {
                                console.log("ok");
                            });
                        });
                    });
                });
            })
        }
    });
}

function getCurrentHostname(tabId) {
    browser.tabs.get(tabId, function(tab) {
function getCurrentTabHostname(callback) {
    const queryInfo = {
        active: true,
        currentWindow: true
    };
    browser.tabs.query(queryInfo, tabs => {
        const tab = tabs[0];
        const url = new URL(tab.url);
        callback(url.hostname); // we call newTabOpen here
    });
}

function checkCurrentHostnameHasToBeBlocked(tabId) {
    browser.tabs.get(tabId, function(tab) {
        const url = new URL(tab.url);
        let currentHostname = url.hostname;

        let maximumTime = getMaximumTime(currentHostname);
        let currentTime = getTimestamp(currentHostname);

        if(currentTime >= maximumTime){
            window.location = "https://www.catgifpage.com/";
        }
    });
}

function checkCurrentHostname(tabId) {
    browser.tabs.get(tabId, function(tab) {
        const url = new URL(tab.url);
        let currentHostname = url.hostname;
        checkHostname(currentHostname);
    });
}

browser.tabs.onActivated.addListener(function (activeInfo) {
    let tabId = activeInfo.tabId;
    getCurrentHostname(tabId);
});

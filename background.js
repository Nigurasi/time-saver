
function getLastHostnamePromise() {
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

function getMaximumTimePromise(currentHostname) {
    return browser.storage.local.get("max");
}

function setMaximumTimePromise(currentHostname, timeSpent) {
    let maxObj;
    getTimeSpentPromise(currentHostname).then(maximumTimeObj => {
        maxObj = maximumTimeObj;
    });
    if (maxObj === undefined) {
        maxObj = {max : {}}
    }
    maxObj.max[currentHostname] = timeSpent;
    browser.storage.local.set(maxObj).then(() => {
        console.log("max for " + currentHostname + " is now " + timeSpent);
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

function checkCurrentHostnameHasToBeBlocked(currentHostname, tabId) {
    getMaximumTimePromise(currentHostname).then(maximumTimeObj => {
        if (maximumTimeObj.max !== undefined) {
            let maximumTime = maximumTimeObj.max[currentHostname];
            if (maximumTime !== undefined) {
                getTimeSpentPromise(currentHostname).then(oldTimeSpentObj => {
                        let oldTimeSpent = oldTimeSpentObj[currentHostname + "-spent"];
                        if (isNaN(oldTimeSpent)) {
                            oldTimeSpent = 0;
                        }
                        if (oldTimeSpent >= maximumTime) {
                            console.log("too much time spent on " + currentHostname);
                            browser.tabs.update(tabId, {url: "https://www.catgifpage.com/"});
                        }
                    }
                );
            }
        }
    });
}

function checkCurrentHostname(tabId) {
    browser.tabs.get(tabId, tab => {
        const url = new URL(tab.url);
        let currentHostname = url.hostname;
        checkHostname(currentHostname);
        checkCurrentHostnameHasToBeBlocked(currentHostname, tabId);
    });
}

browser.tabs.onActivated.addListener(activeInfo => {
    let tabId = activeInfo.tabId;
    checkCurrentHostname(tabId);
});

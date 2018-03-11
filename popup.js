
document.getElementById("addButton").addEventListener("click", addToBlocked);

function getTimeSpentPromise(lastHostname) {
    return browser.storage.local.get(lastHostname + "-spent");
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

function addToBlocked() {
    console.log("clicked");

    let urlToBlock = document.getElementById("url").value;
    let timeTilUnblock = document.getElementById("time").value;
    // let maxTime = timeTilUnblock * 3600 * 1000
    let maxTime = timeTilUnblock * 1000 * 60;
    console.log(urlToBlock);
    console.log(maxTime);

    const url = new URL(urlToBlock);
    const hostname = url.hostname;
    console.log(hostname);

    setMaximumTimePromise(hostname, maxTime);
}

// function getCurrentTabHostname(callback) {
//     const queryInfo = {
//         active: true,
//         currentWindow: true
//     };
//     chrome.tabs.query(queryInfo, tabs => {
//         const tab = tabs[0];
//         const url = new URL(tab.url);
//         callback(url.hostname); // we call newTabOpen here
//     });
// }
//
// function showHostname(hostname) {
//     console.log(hostname);
//     const par = document.querySelector("#domainName");
//     par.textContent = hostname;
// }
//
// document.addEventListener("DOMContentLoaded", () => {
//     getCurrentTabHostname(showHostname)
// });
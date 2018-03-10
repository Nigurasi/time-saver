function checkHostTime(hostnameTimeMap, hostname) {
    if (hostnameTimeMap.has(hostname)) {
        return hostnameTimeMap.get(hostname)
    } else {
        hostnameTimeMap.set("hostname", 0);
        return 0;
    }
}

function newTabOpen(hostname) { // called from getCurrentTabHostname
    openedDate = new Date();
}

function changeHostTimeOnClose(hostnameTimeMap, hostname, timeDuration) {

}

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

function checkCurrentHostname(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        const url = new URL(tab.url);
        let currentHostname = url.hostname;
        console.log(lastTabHostname);
        // if (currentHostname !== lastTabHostname) {
        //     updateHostnameTime(lastTabHostname);
        // }
    });
}


browser.tabs.onActivated.addListener(function (activeInfo) {
    let tabId = activeInfo.tabId;
    checkCurrentHostname(tabId);
});

// function showHostname(hostname) {
//     console.log(hostname);
//     const par = document.querySelector("#domainName");
//     par.textContent = hostname;
// }

// document.addEventListener("DOMContentLoaded", () => {
//     getCurrentTabHostname(showHostname)
// });

// browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     alert(changeInfo.url);
// });

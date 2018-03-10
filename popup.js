

function getCurrentTabHostname(callback) {
    const queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, tabs => {
        const tab = tabs[0];
        const url = new URL(tab.url);
        callback(url.hostname);
    });
}

function showDomain(domain) {
    const par = document.querySelector('#domainName');
    par.textContent = domain;
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabHostname(showDomain)
});
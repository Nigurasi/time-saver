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

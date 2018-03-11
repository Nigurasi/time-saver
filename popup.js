function getTimeSpentPromise(lastHostname) {
    return browser.storage.local.get(lastHostname + "-spent");
}

function getMaximumTimePromise() {
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

function addToBlocked() {
    console.log("clicked");

    let urlToBlock = document.getElementById("url").value;
    let timeTilUnblock = document.getElementById("time").value;
    let maxTime = timeTilUnblock * 1000 * 60;
    console.log(urlToBlock);
    console.log(maxTime);

    const url = new URL(urlToBlock);
    const hostname = url.hostname;
    console.log(hostname);

    setMaximumTimePromise(hostname, maxTime);
}

document.getElementById("addButton").addEventListener("click", addToBlocked);

let list = document.createElement('ul');
document.body.appendChild(list);

getMaximumTimePromise().then(maximumTimeObj => {
    if (maximumTimeObj.max !== undefined) {
        let pairsList = _.toPairs(maximumTimeObj.max);
        for (let i = 0; i < pairsList.length; i++) {
            let listItem = document.createElement('li');
            let hostname = pairsList[i][0];
            let time = pairsList[i][1] / (1000 * 60);
            listItem.textContent = hostname + " : " + time + " min"
            list.appendChild(listItem);
        }
    }
});

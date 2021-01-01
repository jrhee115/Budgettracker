const { response } = require("express");

const request = indexedDB.open ("budget", 1);
let db;
//created database for the budget

request.onupgradeneeded = function(event) {
    const db = events.target.result;
    db.createObjectStore("data", {autoIncrement: true})
};

request.onerror = function (event) {
    console.log("error: ", event.target.errorCode);
}

request.onsuccess = function(event) {
    db = events.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
}

function saveRecord(record) {
    const transaction = db.transaction(["data"], "readwrite");
    const store = transaction.objectStore("data");
    store.add(record);
}

function checkDatabase(){
    const transaction = db.transaction(["data"], "readwrite");
    const store = transaction.objectStore("data");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                header: {
                    Accept: "application/json, text/plain, */*", "content-type": "application/json"
                }
            }).then(response => response.json()).then(() => {
                const transaction = db.transaction(["data"], "readwrite");
                const store = transaction.objectStore("data");
                store.clear();
            });
        }
    }
}
window.addEventListener("online", checkDatabase);

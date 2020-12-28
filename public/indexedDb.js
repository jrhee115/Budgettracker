const request = indexedDB.open ("budget", 1);
let db;
//created database for the budget

request.onupgradeneeded = function(event) {
    const db = events.target.result;
    db.createObjectStore("store", {autoIncrement: true})
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

/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Common functions             *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

let savedStyles = [];//Saved styles

//Returns s promise that resolves to the value of the specified key
//If there is an error, null is returned
function getFromStorage(key) {
    return chrome.storage.local.get(key).then((result) => {
        return result[key];
    }).catch(() => {
        return null;
    });
}

//Saves specified key value pair to storage
function setToStorage(key, value) {
    let obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj);
}

//Save current css of object
function saveCSS(key, qs) {
    let elem = document.querySelector(qs);
    if (elem == null) { return; }
    savedStyles[key] = elem.style;
}

//Set elems css to stored value
function restoreCSS(key, qs) {
    let elem = document.querySelector(qs);
    if (elem == null) { return; }
    elem.style = savedStyles[key];
}

function hideElem(elem) {
    if (elem != null) { elem.style.display = "none"; }
}

function hideElemQS(elemQS) {
    let elem = document.querySelector(elemQS);
    hideElem(elem);
}

function showElem(elem) {
    if (elem != null) { elem.style.display = ""; }
}

function showElemQS(elemQS) {
    let elem = document.querySelector(elemQS);
    showElem(elem);
}

export {getFromStorage, setToStorage, saveCSS, restoreCSS, hideElem, hideElemQS, showElem, showElemQS};
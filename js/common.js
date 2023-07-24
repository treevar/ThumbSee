/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Common functions             *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

//Returns s promise that resolves to the value of the specified key
//If there is an error, null is returned
function getFromStorage(key){
    return chrome.storage.local.get([key]).then((result) => {
        return result[key];
    }).catch(()=>{
        return null;
    });
}

//Saves specified key value pair to storage
function setToStorage(key, value){
    let obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj);
}

export {getFromStorage, setToStorage};
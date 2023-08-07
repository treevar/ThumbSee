/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\ 
 *  ThumbSee - SEE the THUMBnails :)                                         *
 *      Main file                                                            *
 *  Copyright (C) 2023 treevar                                               *
 *                                                                           *
 *                                                                           *
 *  This program is free software: you can redistribute it and/or modify     *
 *  it under the terms of the GNU General Public License as published by     *
 *  the Free Software Foundation, either version 3 of the License, or        *
 *  (at your option) any later version.                                      *
 *                                                                           *
 *  This program is distributed in the hope that it will be useful,          *  
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 *  GNU General Public License for more details.                             *
 *                                                                           *
 *  You should have received a copy of the GNU General Public License        *
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.   *
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const DELAY_TIME = 200;
const TICKOUT = 10 * (1000 / DELAY_TIME);//Seconds * (ticks per second)
const ELEM_QS = "#main-content > div > .card";//selector for element we need to insert before
const DL_BUTTON_QS = "button[title=\"Download\"]";//selector used for finding download button
const BTN_GROUP_QS = ".claim-preview__actions";//selector for group of buttons (follow/join buttons)

//Returns whether the query selector qs is found within the document
function elemExists(qs) {
    return document.querySelector(qs) != null;
}

//Checks every timeout ms for whether the given query selector is found in the document
//Returns a promise that resolves when the given query selector is found
//If it checks ticks times and doesn't find it, it will reject
//ticks is optional, if not included then it will never tickout
function waitForElem(querySelector, timeout, ticks) {
    return new Promise((resolve, reject) => {
        const interID = setInterval(() => {
            if (elemExists(querySelector)) { clearInterval(interID); resolve(); }
            if (ticks != null && ticks-- == 0) { clearInterval(interID); reject("querySelector not found before tickout"); }
        }, timeout);
    });
}

//Updates the scale of the image
//Takes an integer percentage for the scale
function setImageScale(scale) {
    let img = document.getElementById("thumbseeImageMain");
    if (img != null) {
        img.style.width = "auto";
        img.style.maxHeight = scale + "vh";
    }
}

//Adds the thumbnail image to the page
function loadThumbnail(url) {
    let child = document.querySelector(ELEM_QS);
    let sec = document.getElementById("thumbseeImageSection");
    if (sec == null) {//if we havent made the section yet
        sec = document.createElement("section");
        sec.id = "thumbseeImageSection";
        sec.className = "card";
        child.parentNode.insertBefore(sec, child);
    }
    sec.style = "margin-bottom:10px;text-align:center;";
    let img = document.getElementById("thumbseeImageMain");
    if (img == null) {//if we havent already loaded the image
        img = document.createElement("img");
        img.id = "thumbseeImageMain";
        img.className = "media__thumb";
        sec.appendChild(img);
    }
    getFromStorage("imageScale").then((value) => {
        setImageScale(value);
    });
    img.src = url;
}

//Trys to get a thumbnail url for the current page
//Returns a promise that resolves to the thumbnail image url
//If no thumbnail is found then the promise is rejected
function getImageUrl() {
    return new Promise((resolve, reject) => {
        fetch(window.location.href).then((res) => {
            if (res.status != 200) { reject("Response status was not OK"); }
            return res.text();
        }).then((data) => {
            //find a meta tag that contains the thumbnail url
            let startSearchIndex = data.indexOf("content=\"https://thumbnails.odycdn.com");
            if (startSearchIndex == -1) { reject("Thumbnail image url could not be found"); }
            startSearchIndex += 40;//currently the index is at the start of what we searched for, so add 40 to get at the end
            let url = data.substring(data.indexOf("http", startSearchIndex), data.indexOf('"', startSearchIndex));
            resolve(url);
        });
    });
}

async function start() {
    //waits for DL button to be loaded and then loads the image (if an image url was found)
    waitForElem(DL_BUTTON_QS, DELAY_TIME, TICKOUT).then(() => {
        getImageUrl().then((url) => { 
            loadThumbnail(url); 
            //Move download button by the other buttons (follow/join)
            let dlBtn = document.querySelector(DL_BUTTON_QS);
            let btnGroup = document.querySelector(BTN_GROUP_QS);
            btnGroup.prepend(dlBtn);
            //Remove original download button section
            let ogBtnSection = document.querySelector("#main-content > div > .card:not(#thumbseeImageSection)");
            ogBtnSection.style.display = "none";
        }, (err) => { console.log("Thumbsee: " + err); });
    }, ()=>{});
}

let curUrl = null;

//Listener that updates image scale when the stored scale value is changed
browser.storage.onChanged.addListener((changes) => {
    if (changes.imageScale) {
        setImageScale(changes.imageScale.newValue);
    }
});


//whenever the URL changes, call start
const mainInterval = setInterval(() => {
    if (curUrl != window.location.href) {
        curUrl = window.location.href;
        start();
    }
}, DELAY_TIME);

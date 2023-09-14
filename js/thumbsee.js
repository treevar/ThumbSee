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

import("./common.js").then((util) => {
    const DELAY_TIME = 200;//Time between ticks (ms)
    const TICKOUT = 10 * (1000 / DELAY_TIME);//Seconds * (ticks per second)

    const ELEM_QS = "#main-content > div > .card";//selector for element we need to insert before
    const DL_BUTTON_QS = "button[title=\"Download\"]";//selector used for finding download button
    const BTN_GROUP_QS = ".claim-preview__actions";//selector for group of buttons (follow/join buttons)
    const ANON_GROUP_QS = "#main-content > div > .card:last-of-type > div > div:last-of-type > span";//selector used for placing button on anonymous-author uploads when 'Button Group' is selected
    const TITLE_BTN_QS = "#main-content > div > .card:last-of-type > div > div > div";//selector for where to put dl btn in title
    const DL_BTN_SECTION_QS = "#main-content > div > .card:not(#thumbseeImageSection)";//selector for default section containing dl btn
    const POPUP_QS = "#sticky-d-rc";//selector for bottom popup

    //Settings
    let curBtnLoc = "default";
    let enabled = true;
    let popupVis = true;
    let imgScale = 60;
    let curUrl = null;

    //Loads settings from storage
    function init() {
        util.getFromStorage("btnLocation").then((value) => { curBtnLoc = value; });
        util.getFromStorage("enabled").then((value) => { enabled = value; });
        util.getFromStorage("popupVisibility").then((value) => { popupVis = value; });
        util.getFromStorage("imageScale").then((value) => { imgScale = value; });
    }

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
                if (ticks != null && --ticks <= 0) { clearInterval(interID); reject("querySelector not found before tickout"); }
            }, timeout);
        });
    }

    //Move child to be a child of the newParent, either appended or prepended
    function moveChild(child, newParent, append) {
        let elem = document.querySelector(child);
        let parent = document.querySelector(newParent);
        if (append) { parent.append(elem); }
        else { parent.prepend(elem); }
    }

    //Updates the scale of the image
    //Takes an integer percentage for the scale (0-100)
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
        setImageScale(imgScale);
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

    //Moves button to desired location and changes styling to accomodate
    function setBtnLocation(loc) {
        let dlBtn = document.querySelector(DL_BUTTON_QS);
        let ogBtnSection = document.querySelector(DL_BTN_SECTION_QS);
        if (loc == "default") {//Default location
            util.showElem(ogBtnSection);

            //Move dl btn to original position
            let dlBtnLoc = DL_BTN_SECTION_QS + " > div > div:last-of-type";
            if (elemExists(dlBtnLoc + " > .section__actions")) { dlBtnLoc += " > div"; }//Some pages have an extra div the button is in 
            moveChild(DL_BUTTON_QS, dlBtnLoc, true);

            util.restoreCSS("dl_btn", DL_BUTTON_QS);//Restore style of dl btn to original
        }
        else {
            if (loc == "title") {//Title
                dlBtn.style.marginLeft = "10px";
                dlBtn.style.height = "25px";
                dlBtn.style.alignSelf = "center";

                moveChild(DL_BUTTON_QS, TITLE_BTN_QS, true);
            }
            else if (loc == "btngroup") {//Button Group
                util.restoreCSS("dl_btn", DL_BUTTON_QS);
                if (elemExists(BTN_GROUP_QS)) {//Named author uploads
                    moveChild(DL_BUTTON_QS, BTN_GROUP_QS, false);
                }
                else {//Anonymous
                    moveChild(DL_BUTTON_QS, ANON_GROUP_QS, true);
                    dlBtn.style.float = "right";
                }
            }
            //Remove original download button section
            util.hideElem(ogBtnSection);
        }
    }

    //Show/Hide bottom popup
    //if user clicked on popup to close it, it will not be shown when showElem is called
    function setPopupVisibility(visible) {
        if (visible) { util.showElemQS(POPUP_QS); }
        else { util.hideElemQS(POPUP_QS); }
    }

    async function start() {
        if (!enabled) { return; }

        waitForElem(DL_BUTTON_QS, DELAY_TIME, TICKOUT).then(() => {//Wait for DL btn to be loaded (if not, timeout)
            util.saveCSS("dl_btn", DL_BUTTON_QS);//Save style of DL btn (should be default styling)
            setBtnLocation(curBtnLoc);//Move DL btn to desired location
            setPopupVisibility(popupVis);//Hides bottom popup if user wants
            getImageUrl().then((url) => {//Retrieve image url
                loadThumbnail(url);//Add image to page
            }, (err) => { console.log("Thumbsee: " + err); });// :(
        }, () => { });
    }

    //Listener that updates page when settings are changed
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.imageScale != null) {//Image scale
            imgScale = changes.imageScale.newValue;
            setImageScale(imgScale);
        }
        if (changes.btnLocation != null) {//Button location
            curBtnLoc = changes.btnLocation.newValue;
            if (enabled) { setBtnLocation(curBtnLoc); }
        }
        if (changes.enabled != null) {//Enabled/Disabled
            enabled = changes.enabled.newValue;
            let imgSec = document.getElementById("thumbseeImageSection");
            if (enabled) {
                if (imgSec == null) { start(); }
                else {
                    setBtnLocation(curBtnLoc);
                    setPopupVisibility(popupVis);
                    util.showElem(imgSec);
                }
            }
            else {//Disabled
                util.hideElem(imgSec);
                setPopupVisibility(true);
                setBtnLocation("default");
            }
        }
        if (changes.popupVisibility != null) {//Hide/Show bottom popup
            popupVis = changes.popupVisibility.newValue;
            setPopupVisibility(popupVis);
        }
    });


    init();//Load settings

    //whenever the URL changes, call start
    const mainInterval = setInterval(() => {
        if (curUrl != window.location.href) {
            curUrl = window.location.href;
            start();
        }
    }, DELAY_TIME);
});

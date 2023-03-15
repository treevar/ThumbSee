/*
    ThumbSee - SEE the THUMBnails :)
    Copyright (C) 2023 treevar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const DELAY_TIME = 200;
const elemQS = "#main-content > div > .card";//selector for element we need to insert before

//Returns whether the query selctor qs is found within the document
function elemExits(qs){
    return document.querySelector(qs) != null;
}

//Checks every timeout ms for whether the given query selector is found in the document
//Returns a promise that resolves when the given query selector is found
//  note: if the query selector is never found then this doesn't resolve
function waitFormElem(querySelector, timeout){
    return new Promise (function(resolve, reject){
        const interID = setInterval(function(){
            if(elemExits(querySelector)){ clearInterval(interID); resolve(); }
        }, timeout);
         
    });
}


//Adds the thumbnail image to the page
function loadThumbnail(data){
    let child = document.querySelector(elemQS);
    let startI = data.indexOf("https://", data.indexOf("https://thumbnails.odycdn.com") + 30);
    let url = data.substring(startI, data.indexOf('"', startI));//get thumbnail url
    let sec = document.getElementById("thumbseeImageSection");
    if(sec == null){//if we havent made the section yet
        sec = document.createElement('section');
        sec.id = "thumbseeImageSection";
        sec.className = "card";
        child.parentNode.insertBefore(sec, child);
    }
    sec.style = "margin-bottom: 10px; text-align: center;";
    let img = document.getElementById("thumbseeImageMain");
    if(img == null){//if we havent already loaded the image
        img = document.createElement('img');
        sec.appendChild(img);
    }
    img.className = "media__thumb";
    img.style = "max-width:60%;height:auto;";
    img.src = url;
    img.id = "thumbseeImageMain";
    rended = true;
}

//Retuns a promise that resolves in ms milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start(){
    if(window.location.href.match(/^.*:\/\/odysee.com\/@.*\/.*$/)){//are we on a proper page?
        //console.log("ThumbSee: Started");
        await waitFormElem(elemQS, DELAY_TIME);//wait until that element is loaded
        if(document.querySelector("svg.icon.icon--Download") == null){ return; }//are we on a page with a download button?
        //console.log("Loaded");
        fetch(window.location.href).then(function(res){
            return res.text();

        }).then((data) => {
            loadThumbnail(data);
        });
    }

}

let curUrl = null;
//whenever the URL changes, call start
const mainInterval = setInterval(function(){
    if(curUrl != window.location.href){
        curUrl = window.location.href;
        start();
    }
}, DELAY_TIME);
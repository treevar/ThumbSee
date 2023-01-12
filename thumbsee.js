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

const DELAY_TIME = 500;
const DELAY_TIMEOUT = 10000;
const TIMEOUT_STEPS = DELAY_TIMEOUT / DELAY_TIME;

let timeoutTick = 0;

function tick(){
    return ++timeoutTick > TIMEOUT_STEPS;
}

function loadChild(main, data){
    let child = null;
    main = document.getElementById("main-content");
    for(let i in main.children[0].children){
        if(main.children[0].children[i].className == "card"){ child = main.children[0].children[i]; break; }
    }
    if(child == null){
        //if(document.getElementById("vjs_video_3_html5_api")){ return; }//we on a video page
        if(main.children[1].className != "section card-stack file-page__download"){ return; }//we are not on a page where this works
        console.log("ThumbSee: Child was null");
        if(tick()){ timeoutTick = 0; return; }
        setTimeout(()=>{ loadChild(main, data); }, DELAY_TIME);
    }
    else{
        timeoutTick = 0;
        let startI = data.indexOf("https://", data.indexOf("https://thumbnails.odycdn.com") + 30);
        let url = data.substring(startI, data.indexOf('"', startI));//get thumbnail url
        let sec = document.getElementById("thumbseeImageSection");
        if(sec == null){
            sec = document.createElement('section');
            sec.id = "thumbseeImageSection";
            sec.className = "card";
            child.parentNode.insertBefore(sec, child);
        }
        sec.style = "margin-bottom: 10px; text-align: center;";
        let img = document.getElementById("thumbseeImageMain");
        if(img == null){
            img = document.createElement('img');
            sec.appendChild(img);
        }
        img.className = "media__thumb card__first-pane";
        img.style = "max-width:60%;height:auto;";
        img.src = url;
        img.id = "thumbseeImageMain";
        //sec.textContent = "<img class='media__thumb card__first-pane' style='max-width:60%;height:auto;' src='" + url + "' id=thumbseeImageMain>";
    }
}

function loadMain(data){
    let main = document.getElementById("main-content");
    if(main == null){
        console.log("ThumbSee: main was null, page is probably loading still");
        if(tick()){ timeoutTick = 0; console.log("Tick expire"); return; }
        setTimeout(()=>{
            loadMain(data);
        }, DELAY_TIME);
    }
    else{
        timeoutTick = 0;
        loadChild(main, data);
    }
}

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

async function start(){
    if(window.location.href.match(/^.*:\/\/odysee.com\/@.*\/.*$/)){//are we on a proper page?
        console.log("ThumbSee: Started");
        fetch(window.location.href).then(function(res){
            return res.text();

        }).then((data) => {
            loadMain(data);
        });
    }

}
let curUrl = null;
async function main(){
    while(true){
        if(curUrl != window.location.href){//if we clicked on something
            curUrl = window.location.href;
            setTimeout(() => {start();}, DELAY_TIME);//call start in a bit, we want the page to load first
        }
        await sleep(DELAY_TIME);
    }
}
main();

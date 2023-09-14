/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Background script            *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */
import {setToStorage} from "./common.js";

chrome.runtime.onInstalled.addListener((details) => {
  // Check if the extension was installed
  if (details.reason == "install") {
    setToStorage("imageScale", 60);//60% view height max for image
    setToStorage("btnLocation", "default");//Default location
    setToStorage("enabled", true);//Enabled
    setToStorage("popupVisibility", true);//Doesn't hide the popup
  }
});

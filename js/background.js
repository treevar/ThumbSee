/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Background script            *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

browser.runtime.onInstalled.addListener((details) => {
  //Set default settings values when installed
  if (details.reason == "install") {
    setToStorage("imageScale", 60);//60% view height max for image
    setToStorage("btnLocation", "default");//Default location
    setToStorage("enabled", true);//Enabled
    setToStorage("popupVisibility", true);//Doesn't hide the popup
  }
});

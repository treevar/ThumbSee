/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Background script            *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

browser.runtime.onInstalled.addListener((details) => {
  //Set default settings values when installed
  if (details.reason == "install") {
    setToStorage("imageScale", 60);//60% view height max for image
    setToStorage("layout", 0);//Default layout
    setToStorage("enabled", 1);//Enabled
    setToStorage("popupVisibility", 1);//Doesn't hide the popup
  }
});

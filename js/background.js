/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Background script            *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

browser.runtime.onInstalled.addListener((details) => {
  // Check if the extension was installed
  if (details.reason == "install") {
    setToStorage("imageScale", 60);
    setToStorage("layout", 0);
  }
});

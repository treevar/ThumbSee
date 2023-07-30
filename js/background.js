/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Background script            *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */
import * as util from "./common.js";

chrome.runtime.onInstalled.addListener((details) => {
  // Check if the extension was installed
  if (details.reason == "install") {
    util.setToStorage("imageScale", 60);
  }
});

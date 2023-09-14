/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Popup page JS                *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */
import("./common.js").then((util) => {

    let slider = document.getElementById("scaleSlider");
    let sliderValue = document.getElementById("sliderValue");
    let selector = document.getElementById("locSelector");
    let enabledCheck = document.getElementById("enabledCheckbox");
    let popupCheck = document.getElementById("popupCheckbox");
    
    //Display current settings
    
    util.getFromStorage("imageScale").then((value) => {
        slider.value = value;
        sliderValue.textContent = slider.value;
    });
    
    util.getFromStorage("btnLocation").then((value) => {
        selector.value = value;
    });
    
    util.getFromStorage("enabled").then((value) => {
        enabledCheck.checked = value;
    });
    
    util.getFromStorage("popupVisibility").then((value) => {
        popupCheck.checked = !value;
    });
    
    
    
    //Listeners to save settings when user changes them
    
    slider.addEventListener("input", (event) => {
        sliderValue.textContent = event.target.value;
        util.setToStorage("imageScale", event.target.value);
    });
    
    selector.addEventListener("change", (event) => {
        util.setToStorage("btnLocation", event.target.value);
    });
    
    enabledCheck.addEventListener("input", (event) => {
        util.setToStorage("enabled", event.target.checked);
    });
    
    popupCheck.addEventListener("input", (event) => {
        util.setToStorage("popupVisibility", !event.target.checked);
    });
});
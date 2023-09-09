/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Popup page JS                *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

let slider = document.getElementById("scaleSlider");
let sliderValue = document.getElementById("sliderValue");
let selector = document.getElementById("layoutSelector");
let enabledCheck = document.getElementById("enabledCheckbox");
let popupCheck = document.getElementById("popupCheckbox");

//Display current settings

getFromStorage("imageScale").then((value) => {
    slider.value = value;
    sliderValue.textContent = slider.value;
});

getFromStorage("layout").then((value) => {
    selector.value = value;
});

getFromStorage("enabled").then((value) => {
    enabledCheck.checked = value;
});

getFromStorage("popupVisibility").then((value) => {
    popupCheck.checked = !value;
});



//Listeners to save settings when user changes them

slider.addEventListener("input", (event) => {
    document.getElementById("sliderValue").textContent = event.target.value;
    setToStorage("imageScale", event.target.value);
});

selector.addEventListener("change", (event) => {
    setToStorage("layout", event.target.value);
});

enabledCheck.addEventListener("input", (event) => {
    setToStorage("enabled", event.target.checked);
});

popupCheck.addEventListener("input", (event) => {
    setToStorage("popupVisibility", !event.target.checked);
});
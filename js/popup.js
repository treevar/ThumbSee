/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Popup page JS                *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

let slider = document.getElementById("scaleSlider");
let sliderValue = document.getElementById("sliderValue");
let selector = document.getElementById("layoutSelector");

getFromStorage("imageScale").then((value) => {
    slider.value = value;
    sliderValue.textContent = slider.value;
});

getFromStorage("layout").then((value) => {
    selector.value = value;
});

// Add an event listener to update the displayed value when the slider is changed
slider.addEventListener("input", (event) => {
    document.getElementById("sliderValue").textContent = event.target.value;
    setToStorage("imageScale", event.target.value);
});

selector.addEventListener("change", (event)=>{
    setToStorage("layout", event.target.value);
});
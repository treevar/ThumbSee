/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Popup page JS                *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */

let slider = document.getElementById("scaleSlider");
let sliderValue = document.getElementById("sliderValue");

getFromStorage("imageScale").then((value) => {
    slider.value = value;
    sliderValue.textContent = slider.value;
});

// Add an event listener to update the displayed value when the slider is changed
slider.addEventListener("input", (event) => {
    document.getElementById("sliderValue").textContent = event.target.value;
    setToStorage("imageScale", event.target.value);
});
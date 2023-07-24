/* * * * * * * * * * * * * * * * * * *\
 *  ThumbSee - SEE the THUMBnails :) *
 *      Popup page JS                *
 *  Copyright (C) 2023 treevar       *
\* * * * * * * * * * * * * * * * * * */
import("./common.js").then((util) => {
    let slider = document.getElementById("scaleSlider");
    let sliderValue = document.getElementById("sliderValue");

    util.getFromStorage("imageScale").then((value) => {
        slider.value = value;
        sliderValue.textContent = slider.value;
    });

    // Add an event listener to update the displayed value when the slider is changed
    slider.addEventListener("input", (event) => {
        document.getElementById("sliderValue").textContent = event.target.value;
        util.setToStorage("imageScale", event.target.value);
    });
});
//Returns s promise that resolves to the value of the specified key
//If there is an error, null is returned
function getFromStorage(key){
    return browser.storage.local.get(key).then((result) => {
        return result[key];
    }).catch(()=>{
        return null;
    });
}

//Saves specified key value pair to storage
function setToStorage(key, value){
    let obj = {};
    obj[key] = value;
    browser.storage.local.set(obj);
}

let slider = document.getElementById("scaleSlider");
let sliderValue = document.getElementById("sliderValue"); 

getFromStorage("imageScale").then((value)=>{ 
    slider.value = value; 
    sliderValue.textContent = slider.value;
});

// Add an event listener to update the displayed value when the slider is changed
slider.addEventListener("input", (event) => {
    document.getElementById("sliderValue").textContent = event.target.value;
    setToStorage("imageScale", event.target.value);
});
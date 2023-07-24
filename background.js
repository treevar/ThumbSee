//Saves specified key value pair to storage
function setToStorage(key, value){
    let obj = {};
    obj[key] = value;
    browser.storage.local.set(obj);
}

browser.runtime.onInstalled.addListener((details) => {
    // Check if the extension was installed
    if (details.reason == "install") {
      setToStorage("imageScale", 60);
    }
});
  
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("RowAjuster");
  const videoAmmount = document.getElementById("vidAmmount");

  // Update the displayed value when slider changes
  slider.addEventListener("input", function () {
    videoAmmount.textContent = slider.value;
  });

  // Update grid and save when slider changes (on release)
  slider.addEventListener("change", function () {
    videoAmmount.textContent = slider.value;

    // Send message to content script to update YouTube grid
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateGrid",
        perRow: parseInt(slider.value),
      });
    });

    // Save value to storage
    chrome.storage.sync.set({ gridColumns: parseInt(slider.value) });
  });

  // Load saved value from storage
  chrome.storage.sync.get(["gridColumns"], function (result) {
    if (result.gridColumns) {
      slider.value = result.gridColumns;
      videoAmmount.textContent = result.gridColumns;
    }
  });
});

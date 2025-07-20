document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("RowAjuster");
  const videoAmmount = document.getElementById("vidAmmount");
  const removeShortsCheckbox = document.getElementById("removeShorts");
  const removeExploreCheckbox = document.getElementById("removeExplore");
  const customAlert = document.getElementById("customAlert");

  // Custom alert function
  function showCustomAlert() {
    // Show alert with animation
    customAlert.classList.add("show");

    // Hide alert after 3 seconds
    setTimeout(() => {
      customAlert.classList.remove("show");
    }, 3000);
  }

  // shorts functionality
  removeShortsCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeShortsCheckbox.checked) {
      showCustomAlert();
    }
    // Save the checkbox state to storage
    chrome.storage.sync.set({ removeShorts: removeShortsCheckbox.checked });
    // Send message to content script to toggle Shorts removal
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleShorts",
        enabled: removeShortsCheckbox.checked,
      });
    });
  });

  // explore more functionality
  removeExploreCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeExploreCheckbox.checked) {
      showCustomAlert();
    }
    // Save the checkbox state to storage
    chrome.storage.sync.set({ removeExploreMore: removeExploreCheckbox.checked });
    // Send message to content script to toggle Explore More removal
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleExploreMore",
        enabled: removeExploreCheckbox.checked,
      });
    });
  });

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
  chrome.storage.sync.get(["gridColumns", "removeShorts", "removeExploreMore"], function (result) {
    if (result.gridColumns) {
      slider.value = result.gridColumns;
      videoAmmount.textContent = result.gridColumns;
    }
    // Load checkbox state
    removeShortsCheckbox.checked = result.removeShorts || false;
    removeExploreCheckbox.checked = result.removeExploreMore || false;
  });
});

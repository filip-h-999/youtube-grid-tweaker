document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("RowAjuster");
  const videoAmmount = document.getElementById("vidAmmount");
  const removeShortsCheckbox = document.getElementById("removeShorts");
  const removeExploreCheckbox = document.getElementById("removeExplore");
  const removeChannelNamesCheckbox = document.getElementById("removeChannelNames");
  const removeViewsCheckbox = document.getElementById("removeViews");
  const removeTimePostedCheckbox = document.getElementById("removeTimePosted");
  const customAlert = document.getElementById("customAlert");

  // Dropdown elements
  const viewOptionsToggle = document.getElementById("viewOptionsToggle");
  const viewOptionsContent = document.getElementById("viewOptionsContent");

  // Dropdown toggle functionality
  viewOptionsToggle.addEventListener("click", function () {
    const isExpanded = viewOptionsContent.classList.contains("expanded");

    if (isExpanded) {
      viewOptionsContent.classList.remove("expanded");
      viewOptionsToggle.classList.remove("expanded");
    } else {
      viewOptionsContent.classList.add("expanded");
      viewOptionsToggle.classList.add("expanded");
    }
  });

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

  // channel names functionality
  removeChannelNamesCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeChannelNamesCheckbox.checked) {
      showCustomAlert();
    }
    // Save the checkbox state to storage
    chrome.storage.sync.set({ removeChannelNames: removeChannelNamesCheckbox.checked });
    // Send message to content script to toggle Channel Names removal
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleChannelNames",
        enabled: removeChannelNamesCheckbox.checked,
      });
    });
  });

  // views functionality
  removeViewsCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeViewsCheckbox.checked) {
      showCustomAlert();
    }
    // Save the checkbox state to storage
    chrome.storage.sync.set({ removeViews: removeViewsCheckbox.checked });
    // Send message to content script to toggle Views removal
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleViews",
        enabled: removeViewsCheckbox.checked,
      });
    });
  });

  // time posted functionality
  removeTimePostedCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeTimePostedCheckbox.checked) {
      showCustomAlert();
    }
    // Save the checkbox state to storage
    chrome.storage.sync.set({ removeTimePosted: removeTimePostedCheckbox.checked });
    // Send message to content script to toggle Time Posted removal
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleTimePosted",
        enabled: removeTimePostedCheckbox.checked,
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
  chrome.storage.sync.get(
    [
      "gridColumns",
      "removeShorts",
      "removeExploreMore",
      "removeChannelNames",
      "removeViews",
      "removeTimePosted",
    ],
    function (result) {
      if (result.gridColumns) {
        slider.value = result.gridColumns;
        videoAmmount.textContent = result.gridColumns;
      }
      // Load checkbox state
      removeShortsCheckbox.checked = result.removeShorts || false;
      removeExploreCheckbox.checked = result.removeExploreMore || false;
      removeChannelNamesCheckbox.checked = result.removeChannelNames || false;
      removeViewsCheckbox.checked = result.removeViews || false;
      removeTimePostedCheckbox.checked = result.removeTimePosted || false;
    }
  );
});

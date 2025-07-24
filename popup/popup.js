if (typeof browser === "undefined") {
  var browser = chrome;
}

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

  // Save settings to storage
  function saveSettingsToStorage(remove, removeCheckbox, toggel) {
    browser.storage.local.set({ [remove]: removeCheckbox.checked });
    // Send message to content script to toggle Shorts removal
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: toggel,
        enabled: removeCheckbox.checked,
      });
    });
  }

  // Custom alert function
  function showCustomAlert() {
    // only on shorts and explore more
    if (!removeShortsCheckbox.checked || !removeExploreCheckbox.checked) {
      customAlert.classList.add("show");
    }
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
    saveSettingsToStorage("removeShorts", removeShortsCheckbox, "toggleShorts");
  });

  removeExploreCheckbox.addEventListener("change", function () {
    // Show custom alert when unchecking
    if (!removeExploreCheckbox.checked) {
      showCustomAlert();
    }
    saveSettingsToStorage("removeExploreMore", removeExploreCheckbox, "toggleExploreMore");
  });

  removeChannelNamesCheckbox.addEventListener("change", function () {
    if (!removeChannelNamesCheckbox.checked) {
      showCustomAlert();
    }
    saveSettingsToStorage("removeChannelNames", removeChannelNamesCheckbox, "toggleChannelNames");
  });

  removeViewsCheckbox.addEventListener("change", function () {
    if (!removeViewsCheckbox.checked) {
      showCustomAlert();
    }
    saveSettingsToStorage("removeViews", removeViewsCheckbox, "toggleViews");
  });

  removeTimePostedCheckbox.addEventListener("change", function () {
    if (!removeTimePostedCheckbox.checked) {
      showCustomAlert();
    }
    saveSettingsToStorage("removeTimePosted", removeTimePostedCheckbox, "toggleTimePosted");
  });

  // Update the displayed value when slider changes
  slider.addEventListener("input", function () {
    videoAmmount.textContent = slider.value;
  });

  // Update grid and save when slider changes (on release)
  slider.addEventListener("change", function () {
    videoAmmount.textContent = slider.value;

    // Send message to content script to update YouTube grid
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: "updateGrid",
        perRow: parseInt(slider.value),
      });
    });
    // Save value to storage
    browser.storage.local.set({ gridColumns: parseInt(slider.value) });
  });

  // Load saved value from storage
  browser.storage.local.get(
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

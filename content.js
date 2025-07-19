function updateGridLayout(perRow = 5) {
  // Find ALL grid renderers on the page, not just the first one
  const grids = document.querySelectorAll("ytd-rich-grid-renderer");
  grids.forEach((grid, index) => {
    grid.style.setProperty("--ytd-rich-grid-items-per-row", perRow);
  });
}

function removeShorts() {
  // Remove Shorts from sidebar navigation
  document.querySelectorAll('a.yt-simple-endpoint[title="Shorts"]').forEach((el) => {
    shorts = el.closest("ytd-guide-entry-renderer")
    if (shorts) shorts.remove();
  });

  // Also remove any other Shorts links
  document.querySelectorAll('a[title="Shorts"]').forEach((el) => {
    shorts = el.closest("ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer");
    if (shorts) shorts.remove();
  });

  // Remove Shorts sections using the better selector
  document.querySelectorAll("ytd-rich-section-renderer").forEach((section) => {
    if (section.textContent.toLowerCase().includes("shorts")) {
      console.log("Removing Shorts section:", section);
      section.remove();
    }
  });

  // Also remove any Shorts from rich shelf renderers
  document.querySelectorAll("ytd-rich-shelf-renderer").forEach((shelf) => {
    if (shelf.textContent.toLowerCase().includes("shorts")) {
      console.log("Removing Shorts shelf:", shelf);
      shelf.remove();
    }
  });
}

// Load saved value from storage and apply it
chrome.storage.sync.get(["gridColumns"], function (result) {
  const columns = result.gridColumns || 5;
  updateGridLayout(columns);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateGrid") {
    updateGridLayout(request.perRow);
  }
});

// observe for dynamic youTube page changes
const observer = new MutationObserver(() => {
  chrome.storage.sync.get(["gridColumns"], function (result) {
    const columns = result.gridColumns || 5;
    updateGridLayout(columns);
  });

  // Also remove Shorts when page content changes
  removeShorts();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

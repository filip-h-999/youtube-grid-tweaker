function updateGridLayout(perRow = 5) {
  // Find ALL grid renderers on the page, not just the first one
  const grids = document.querySelectorAll("ytd-rich-grid-renderer");
  let updatedCount = 0;

  console.log(`Found ${grids.length} grid renderer(s) on page`);

  grids.forEach((grid, index) => {
    grid.style.setProperty("--ytd-rich-grid-items-per-row", perRow);
    console.log(`Updated grid ${index + 1} to ${perRow} columns`);
    updatedCount++;
  });

  if (updatedCount > 0) {
    console.log(`Successfully updated ${updatedCount} grid renderer(s)`);
  } else {
    console.log("No grid renderers found on this page");
  }
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
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

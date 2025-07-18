function updateGridLayout(perRow = 5) {
  const grid = document.querySelector('ytd-rich-grid-renderer');
  if (grid) {
    grid.style.setProperty('--ytd-rich-grid-items-per-row', perRow);
  }
}

// Load saved value from storage and apply it
chrome.storage.sync.get(['gridColumns'], function(result) {
  const columns = result.gridColumns || 5;
  updateGridLayout(columns);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateGrid') {
    updateGridLayout(request.perRow);
  }
});

// observe for dynamic youTube page changes
const observer = new MutationObserver(() => {
  chrome.storage.sync.get(['gridColumns'], function(result) {
    const columns = result.gridColumns || 5;
    updateGridLayout(columns);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

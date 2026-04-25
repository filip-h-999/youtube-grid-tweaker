if (typeof browser === "undefined") {
  var browser = chrome;
}

function updateGridLayout(perRow = 5) {
  // Find ALL grid renderers on the page, not just the first one
  const grids = document.querySelectorAll("ytd-rich-grid-renderer");
  grids.forEach((grid, index) => {
    grid.style.setProperty("--ytd-rich-grid-items-per-row", perRow);
  });
}

function removeElements(config) {
  const { selector, textIncludes, action = "remove", closest, attribute, customCheck } = config;

  document.querySelectorAll(selector).forEach((element) => {
    let shouldProcess = true;

    // Check if text content should include specific text
    if (textIncludes) {
      shouldProcess = element.textContent.toLowerCase().includes(textIncludes.toLowerCase());
    }

    // Check if element has specific attribute value
    if (attribute && shouldProcess) {
      shouldProcess = element.getAttribute(attribute.name) === attribute.value;
    }

    // Check custom condition
    if (customCheck && shouldProcess) {
      shouldProcess = customCheck(element);
    }

    if (shouldProcess) {
      // Find the target element
      const targetElement = closest ? element.closest(closest) : element;

      if (targetElement) {
        if (action === "remove") {
          targetElement.remove();
        } else if (action === "hide") {
          targetElement.style.display = "none";
        } else if (action === "show") {
          targetElement.style.display = "";
        }
      }
    }
  });
}

function removeShorts() {
  // Remove Shorts from sidebar navigation
  removeElements({
    selector: "a.yt-simple-endpoint",
    attribute: { name: "title", value: "Shorts" },
    closest: "ytd-guide-entry-renderer",
  });

  // Also remove any other Shorts links
  removeElements({
    selector: 'a[title="Shorts"]',
    closest: "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer",
  });

  // Remove Shorts sections
  removeElements({
    selector: "ytd-rich-section-renderer",
    textIncludes: "shorts",
  });

  // Remove Shorts from shelves
  removeElements({
    selector: "ytd-reel-shelf-renderer",
    textIncludes: "shorts",
  });

  // Remove Shorts from search
  removeElements({
    selector: "grid-shelf-view-model",
    textIncludes: "shorts",
  });
}

function removeExploreMore() {
  removeElements({
    selector: "ytd-rich-section-renderer",
    textIncludes: "explore more",
  });
}

function removeMostRelevantSubPage(){
  removeElements({
    selector: "ytd-rich-shelf-renderer",
    textIncludes: "most relevant",
  })
}

function removeYoutubeFeatured(){
  removeElements({
    selector: "style-scope ytd-rich-section-renderer",
    textIncludes: "Youtube featured",
  })
}

// Helper functions for toggling features
function toggleChannelNames(enabled) {
  // Try both old and new selectors for channel names
  const channelSelectors = [
    "#channel-name",
    "#channel-name a",
    "ytd-channel-name a",
    ".yt-content-metadata-view-model__metadata-row a[href*='/@']",
    ".yt-content-metadata-view-model__metadata-row a[href*='/channel/']"
  ];
  
  channelSelectors.forEach(selector => {
    removeElements({
      selector: selector,
      action: enabled ? "hide" : "show",
    });
  });
}

function toggleViews(enabled) {
  // Updated selectors for the new YouTube structure
  const viewSelectors = [
    "ytd-video-meta-block #metadata-line span",
    ".yt-content-metadata-view-model__metadata-row span",
    ".yt-content-metadata-view-model__metadata-row",
    "#metadata-line span",
    ".ytd-video-meta-block span"
  ];
  
  viewSelectors.forEach(selector => {
    removeElements({
      selector: selector,
      textIncludes: "view",
      action: enabled ? "hide" : "show",
    });
  });
}

function toggleTimePosted(enabled) {
  // Updated selectors for the new YouTube structure
  const timeSelectors = [
    "ytd-video-meta-block #metadata-line span",
    ".yt-content-metadata-view-model__metadata-row span",
    ".yt-content-metadata-view-model__metadata-row",
    "#metadata-line span",
    ".ytd-video-meta-block span"
  ];
  
  timeSelectors.forEach(selector => {
    removeElements({
      selector: selector,
      action: enabled ? "hide" : "show",
      customCheck: (element) => {
        return (
          element.textContent &&
          element.textContent.match(/\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/)
        );
      },
    });
  });
}

// Action handlers
const MESSAGE_HANDLERS = {
  updateGrid: (request) => updateGridLayout(request.perRow),
  toggleShorts: (request) => {
    if (request.enabled) {
      removeShorts();
    }
    // Note: Cannot restore removed Shorts elements, page refresh needed
  },
  toggleExploreMore: (request) => {
    if (request.enabled) {
      removeExploreMore();
    }
    // Note: Cannot restore removed Explore More elements, page refresh needed
  },
  toggleMostRelevant: (request) => {
    if (request.enabled){
      removeMostRelevantSubPage();
    }
    // Note: Cannot restore removed Most Relevant elements, page refresh needed
  },
  toggleYoutubeFeatured: (request) => {
    if (request.enabled){
      removeYoutubeFeatured();
    }
    // Note: Cannot restore removed Youtube Featured elements, page refresh needed
  },
  toggleChannelNames: (request) => toggleChannelNames(request.enabled),
  toggleViews: (request) => toggleViews(request.enabled),
  toggleTimePosted: (request) => toggleTimePosted(request.enabled),
};

// Listen for messages from popup
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    const handler = MESSAGE_HANDLERS[request.action];
    if (handler) {
      handler(request);
    }
  } catch (error) {
    if (error.message.includes("Extension context invalidated")) {
      console.log("Extension context invalidated, ignoring message");
    } else {
      console.error("Error in message handler:", error);
    }
  }
});

// Function to apply all features based on storage settings
function applyAllFeatures(params) {
  const columns = params.gridColumns || 5;
  const shouldRemoveShorts = params.removeShorts || false;
  const shouldRemoveExploreMore = params.removeExploreMore || false;
  const shouldRemoveChannelNames = params.removeChannelNames || false;
  const shouldRemoveViews = params.removeViews || false;
  const shouldRemoveTimePosted = params.removeTimePosted || false;
  const shouldRemoveMostRelevant = params.removeMostRelevantSubPage || false;
  const shouldRemoveYoutubeFeatured = params.removeYoutubeFeatured || false;

  updateGridLayout(columns);

  if (shouldRemoveShorts) {
    removeShorts();
  }
  if (shouldRemoveExploreMore) {
    removeExploreMore();
  }
  if (shouldRemoveChannelNames) {
    toggleChannelNames(true);
  }
  if (shouldRemoveViews) {
    toggleViews(true);
  }
  if (shouldRemoveTimePosted) {
    toggleTimePosted(true);
  }
  if (shouldRemoveMostRelevant){
    removeMostRelevantSubPage();
  }
  if (shouldRemoveYoutubeFeatured){
    removeYoutubeFeatured();
  }
}

// Observe for dynamic YouTube page changes
const observer = new MutationObserver(() => {
  try {
    // Check if extension context is still valid before accessing storage
    if (!browser.runtime?.id) {
      observer.disconnect();
      return;
    }

    browser.storage.local.get(
      [
        "gridColumns",
        "removeShorts",
        "removeExploreMore",
        "removeChannelNames",
        "removeViews",
        "removeTimePosted",
        "removeMostRelevantSubPage",
        "removeYoutubeFeatured",
      ],
      applyAllFeatures
    );
  } catch (error) {
    if (error.message.includes("Extension context invalidated")) {
      observer.disconnect();
    } else {
      console.error("Error in mutation observer:", error);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

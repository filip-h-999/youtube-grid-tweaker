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
    shorts = el.closest("ytd-guide-entry-renderer");
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
      // console.log("Removing Shorts section:", section);
      section.remove();
    }
  });

  // Remove Shorts from reel shelves(right side bar)
  document.querySelectorAll("ytd-reel-shelf-renderer").forEach((section) => {
    if (section.textContent.toLowerCase().includes("shorts")) {
      section.remove();
    }
  });

  // Also remove any Shorts from rich shelf renderers
  document.querySelectorAll("ytd-rich-shelf-renderer").forEach((shelf) => {
    if (shelf.textContent.toLowerCase().includes("shorts")) {
      // console.log("Removing Shorts shelf:", shelf);
      shelf.remove();
    }
  });
}

function removeExploreMore() {
  document.querySelectorAll("ytd-rich-section-renderer").forEach((section) => {
    if (section.textContent.toLowerCase().includes("explore more")) {
      // console.log("Removing Explore More section:", section);
      section.remove();
    }
  });
}

function removeChannelName() {
  // Remove channel names
  document.querySelectorAll("#channel-name").forEach((channel) => {
    channel.style.display = "none";
  });
}

function removeViews() {
  // Remove view counts from video listings
  document.querySelectorAll("ytd-video-meta-block #metadata-line span").forEach((span) => {
    if (span.textContent && span.textContent.includes("views")) {
      span.style.display = "none";
    }
  });
}

function removeTimePosted() {
  // Remove time posted from video listings
  document.querySelectorAll("ytd-video-meta-block #metadata-line span").forEach((span) => {
    if (
      span.textContent &&
      span.textContent.match(/\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/)
    ) {
      span.style.display = "none";
    }
  });
}

// Load saved value from storage and apply it
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
    const columns = result.gridColumns || 5;
    const shouldRemoveShorts = result.removeShorts || false;
    const shouldRemoveExploreMore = result.removeExploreMore || false;
    const shouldRemoveChannelNames = result.removeChannelNames || false;
    const shouldRemoveViews = result.removeViews || false;
    const shouldRemoveTimePosted = result.removeTimePosted || false;

    updateGridLayout(columns);

    if (shouldRemoveShorts) {
      removeShorts();
    }
    if (shouldRemoveExploreMore) {
      removeExploreMore();
    }
    if (shouldRemoveChannelNames) {
      removeChannelName();
    }
    if (shouldRemoveViews) {
      removeViews();
    }
    if (shouldRemoveTimePosted) {
      removeTimePosted();
    }
  }
);

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateGrid") {
    updateGridLayout(request.perRow);
  }
  if (request.action === "toggleShorts") {
    if (request.enabled) {
      removeShorts();
    }
    // Note: Cannot restore removed Shorts elements, page refresh needed
  }
  if (request.action === "toggleExploreMore") {
    if (request.enabled) {
      removeExploreMore();
    }
    // Note: Cannot restore removed Explore More elements, page refresh needed
  }
  if (request.action === "toggleChannelNames") {
    if (request.enabled) {
      removeChannelName();
    } else {
      // Restore channel names by showing them again
      document.querySelectorAll("#channel-name").forEach((channel) => {
        channel.style.display = "";
      });
    }
  }
  if (request.action === "toggleViews") {
    if (request.enabled) {
      removeViews();
    } else {
      // Restore views by showing them again
      document.querySelectorAll("ytd-video-meta-block #metadata-line span").forEach((span) => {
        if (span.textContent && span.textContent.includes("views")) {
          span.style.display = "";
        }
      });
    }
  }
  if (request.action === "toggleTimePosted") {
    if (request.enabled) {
      removeTimePosted();
    } else {
      // Restore time posted by showing them again
      document.querySelectorAll("ytd-video-meta-block #metadata-line span").forEach((span) => {
        if (
          span.textContent &&
          span.textContent.match(/\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/)
        ) {
          span.style.display = "";
        }
      });
    }
  }
});

// observe for dynamic youTube page changes
const observer = new MutationObserver(() => {
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
      const columns = result.gridColumns || 5;
      const shouldRemoveShorts = result.removeShorts || false;
      const shouldRemoveExploreMore = result.removeExploreMore || false;
      const shouldRemoveChannelNames = result.removeChannelNames || false;
      const shouldRemoveViews = result.removeViews || false;
      const shouldRemoveTimePosted = result.removeTimePosted || false;

      updateGridLayout(columns);

      // Remove content when page changes if enabled
      if (shouldRemoveShorts) {
        removeShorts();
      }
      if (shouldRemoveExploreMore) {
        removeExploreMore();
      }
      if (shouldRemoveChannelNames) {
        removeChannelName();
      }
      if (shouldRemoveViews) {
        removeViews();
      }
      if (shouldRemoveTimePosted) {
        removeTimePosted();
      }
    }
  );
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

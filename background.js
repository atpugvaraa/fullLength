chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.action === "START_CAPTURE") {
    // Inject the content script into the active tab to handle the scrolling
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ["content.js"]
    });
  }

  // The content script will ask the background script to take a snapshot
  if (message.action === "TAKE_SNAPSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ image: dataUrl });
    });
    return true; // Keeps the message channel open for the async response
  }
});

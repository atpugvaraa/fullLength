document.getElementById('captureBtn').addEventListener('click', async () => {
  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Tell the background script to start the engine
  chrome.runtime.sendMessage({ action: "START_CAPTURE", tabId: tab.id });
});

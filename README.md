# fullLength

A simple Chrome extension for capturing a full-page screenshot as a PNG handy for saving design inspiration.

## Install

1. Download or clone this repository.
2. In Chrome, open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `fullLength` folder.

## Use

1. Open the page you want to capture.
2. Click the **fullLength** extension icon.
3. Select **Capture Full Page!**.
4. The screenshot is saved as `<site-hostname>-fullLength.png`.

The extension captures the active tab by scrolling through the page and stitching the screenshots together. Some browser pages, such as `chrome://` pages, cannot be captured by extensions.

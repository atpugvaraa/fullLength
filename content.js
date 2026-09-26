(async function initCapture() {
  // Prevent multiple injections
  if (window.isCapturing) return;
  window.isCapturing = true;

  const screenshots = [];
  const totalHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  let currentScroll = 0;

  // 1. Hide scrollbars to avoid ugly lines in the stitched image
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // 2. Loop: Scroll, wait, capture
  while (currentScroll < totalHeight) {
    const remainder = totalHeight % viewportHeight;
    console.log(remainder);

    window.scrollTo(0, currentScroll);

    // Wait for dynamic content/lazy loading to render
    await new Promise(resolve => setTimeout(resolve, 300));

    // Ask background.js to take a screenshot
    const response = await chrome.runtime.sendMessage({ action: "TAKE_SNAPSHOT" });
    screenshots.push(response.image);

    currentScroll += viewportHeight;
  }

  // Restore scrollbars and scroll position
  document.body.style.overflow = originalOverflow;
  window.scrollTo(0, 0);

  // 3. Stitching time!
  stitchImages(screenshots, totalHeight, viewportHeight);
  window.isCapturing = false;
})();

async function stitchImages(images, totalHeight, viewportHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio;

  // Note: For retina displays, you usually need to multiply these by window.devicePixelRatio
  canvas.width = document.documentElement.clientWidth * dpr;
  canvas.height = totalHeight * dpr;
  ctx.scale(dpr, dpr);

  let yOffset = 0;

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = images[i];
    await new Promise(resolve => img.onload = resolve);

    const isLast = (i === images.length - 1);

    // Draw each screenshot onto the canvas
    if (isLast) {
      ctx.drawImage(img, 0, totalHeight - viewportHeight, document.documentElement.clientWidth, viewportHeight);
    } else {
      ctx.drawImage(img, 0, yOffset, document.documentElement.clientWidth, viewportHeight);
    }
    yOffset += viewportHeight;
  }

  // 4. Trigger the download
  const finalImage = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const siteURL = location.hostname
  link.download = `${siteURL}-fullLength.png`;
  link.href = finalImage;
  link.click();
}

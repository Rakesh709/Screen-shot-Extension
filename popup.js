document.getElementById("screenshotBtn").addEventListener("click", async () => {
    try {
      // Capture the visible tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
        // Add timestamp and download the screenshot
        addTimestampAndDownload(dataUrl);
      });
    } catch (error) {
      console.error("Failed to take a screenshot: ", error);
    }
  });
  
  // Function to add a timestamp to the screenshot
  function addTimestampAndDownload(dataUrl) {
    const img = new Image();
    img.src = dataUrl;
    
    img.onload = function() {
      // Create a canvas to draw the image and text
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height + 50; // Add extra space for timestamp
      const ctx = canvas.getContext("2d");
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Add timestamp text
      const timestamp = new Date().toLocaleString();
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(timestamp, 10, img.height + 30); // Position the text
      
      // Convert canvas to image and download
      const screenshotWithTime = canvas.toDataURL("image/png");
      downloadScreenshot(screenshotWithTime);
    };
  }
  
  // Download the screenshot
  function downloadScreenshot(dataUrl) {
    const filename = `screenshot-${Date.now()}.png`;
    chrome.downloads.download({
      url: dataUrl,
      filename: filename
    });
  }
  
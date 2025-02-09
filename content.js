// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fillContent") {
    // Get the active element (input or textarea)
    const activeElement = document.activeElement;

    // Check if the active element is an input or textarea
    if (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA")
    ) {
      // Set the value of the input/textarea to the content
      activeElement.value = message.content;

      // Trigger input event to ensure any listeners are notified
      const event = new Event("input", { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  }
});

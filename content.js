// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fillContent") {
    // Get the active element
    const activeElement = document.activeElement;
    if (!activeElement) {
      return;
    }

    // Handle input and textarea elements
    if (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA"
    ) {
      activeElement.value = message.content;

      // Trigger input event
      const event = new Event("input", { bubbles: true });

      activeElement.dispatchEvent(event);
    }
    // Handle contenteditable elements
    else if (activeElement.isContentEditable) {
      activeElement.textContent = message.content;

      // Trigger input event for contenteditable
      const event = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
      });

      activeElement.dispatchEvent(event);
    }
  }
});

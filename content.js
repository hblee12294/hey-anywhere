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
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const currentValue = activeElement.value;

      // Insert content at cursor position
      activeElement.value =
        currentValue.slice(0, start) +
        message.content +
        currentValue.slice(end);

      // Move cursor to end of inserted content
      activeElement.setSelectionRange(
        start + message.content.length,
        start + message.content.length
      );

      const event = new Event("input", { bubbles: true });

      activeElement.dispatchEvent(event);
    }
    // Handle contenteditable elements
    else if (activeElement.isContentEditable) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Delete any selected text
      range.deleteContents();

      // Insert new content at cursor position
      const textNode = document.createTextNode(message.content);
      range.insertNode(textNode);

      // Move cursor to end of inserted content
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      const event = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
      });

      activeElement.dispatchEvent(event);
    }
  }
});

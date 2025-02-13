export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "fillContent") {
        const activeElement = document.activeElement;

        if (!activeElement) {
          return;
        }

        if (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA"
        ) {
          const inputElement = activeElement as HTMLInputElement;

          const start = inputElement.selectionStart ?? 0;
          const end = inputElement.selectionEnd ?? 0;
          const currentValue = inputElement.value;

          // Insert content at cursor position
          inputElement.value =
            currentValue.slice(0, start) +
            message.content +
            currentValue.slice(end);

          // Move cursor to end of inserted content
          inputElement.setSelectionRange(
            start + message.content.length,
            start + message.content.length
          );

          const event = new Event("input", { bubbles: true });

          activeElement.dispatchEvent(event);
        }
        // Handle contenteditable elements
        else if ((activeElement as HTMLElement).isContentEditable) {
          const selection = window.getSelection();

          if (!selection) {
            return;
          }

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

          const event = new InputEvent("input", {
            bubbles: true,
            cancelable: true,
          });

          activeElement.dispatchEvent(event);
        }
      }
    });
  },
});

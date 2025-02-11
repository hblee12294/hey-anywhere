import { languages } from "./config.js";

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

// Update the languages array
const displayLanguages = languages.map(
  (lang) => lang.charAt(0).toUpperCase() + lang.slice(1)
);

// Create and add styles
const style = document.createElement("style");
style.textContent = `
  .ai-fill-button {
    position: absolute;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    z-index: 10000;
    font-size: 14px;
  }
  .ai-language-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: none;
    z-index: 10001;
    max-height: 300px;
    overflow-y: auto;
  }
  .ai-language-menu button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
  }
  .ai-language-menu button:hover {
    background: #f0f0f0;
  }
`;
document.head.appendChild(style);

// Create UI elements
const fillButton = document.createElement("button");
fillButton.className = "ai-fill-button";
fillButton.textContent = "AI Fill";
fillButton.style.display = "none";

const languageMenu = document.createElement("div");
languageMenu.className = "ai-language-menu";

document.body.appendChild(fillButton);
document.body.appendChild(languageMenu);

// Track the last focused editable element and its selection/range
let lastFocusedElement = null;
let lastSelectionRange = null;

// Handle click on editable elements
document.addEventListener("click", (e) => {
  const target = e.target;

  // Check if clicked element is editable
  if (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  ) {
    lastFocusedElement = target;
    // Store selection range for contenteditable elements
    if (target.isContentEditable) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        lastSelectionRange = selection.getRangeAt(0).cloneRange();
      }
    }

    // Position the button near the cursor
    const rect = target.getBoundingClientRect();
    fillButton.style.display = "block";
    fillButton.style.top = `${rect.top + window.scrollY - 30}px`;
    fillButton.style.left = `${rect.left + window.scrollX}px`;
  } else {
    // Hide button and menu when clicking elsewhere
    if (!fillButton.contains(e.target) && !languageMenu.contains(e.target)) {
      fillButton.style.display = "none";
      languageMenu.style.display = "none";
    }
  }
});

// Create language menu buttons
languageMenu.innerHTML = ""; // Clear existing buttons
displayLanguages.forEach((displayLang) => {
  const button = document.createElement("button");
  button.textContent = displayLang;
  button.onclick = () => {
    if (lastFocusedElement) {
      lastFocusedElement.focus();

      if (lastFocusedElement.isContentEditable && lastSelectionRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(lastSelectionRange);
      }

      chrome.runtime.sendMessage({
        action: "requestContent",
        language: displayLang.toLowerCase(),
      });
    }
    languageMenu.style.display = "none";
    fillButton.style.display = "none";
  };
  languageMenu.appendChild(button);
});

// Toggle language menu when clicking the fill button
fillButton.onclick = (e) => {
  e.stopPropagation();
  const buttonRect = fillButton.getBoundingClientRect();
  languageMenu.style.display =
    languageMenu.style.display === "block" ? "none" : "block";
  languageMenu.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
  languageMenu.style.left = `${buttonRect.left + window.scrollX}px`;
};

// Hide menu when clicking outside
document.addEventListener("click", (e) => {
  if (!languageMenu.contains(e.target) && !fillButton.contains(e.target)) {
    languageMenu.style.display = "none";
  }
});

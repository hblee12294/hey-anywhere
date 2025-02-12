import { languages } from "./config.js";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

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

// Create the language menu content
const createLanguageMenu = () => {
  const div = document.createElement("div");
  div.className = "ai-language-menu";

  languages.forEach((lang) => {
    const button = document.createElement("button");
    button.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
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
          language: lang,
        });

        // Hide both tippys
        // mainTippy.hide();
        // // Find and hide the language menu tippy
        // const languageMenuTippy =
        //   document.querySelector(".ai-fill-button")._tippy;
        // if (languageMenuTippy) {
        //   languageMenuTippy.hide();
        // }
      }
    };
    div.appendChild(button);
  });

  return div;
};

// Create the main AI Fill button
const createMainButton = () => {
  const button = document.createElement("button");
  button.className = "ai-fill-button";
  button.textContent = "AI Fill";
  return button;
};

// Create and add styles
const style = document.createElement("style");
style.textContent = `
  .ai-fill-button {
    background: red;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
  }
  .ai-fill-button:hover {
    background: #45a049;
  }
  .ai-language-menu button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    margin: 4px 0;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  .ai-language-menu button:hover {
    background: #f0f0f0;
  }
`;
document.head.appendChild(style);

// Create an invisible anchor element for the main tippy
const anchor = document.createElement("div");
anchor.style.display = "none";
document.body.appendChild(anchor);

// Initialize main tippy (AI Fill button)
const mainTippy = tippy(anchor, {
  content: createMainButton(),
  trigger: "manual",
  placement: "top",
  theme: "light",
  interactive: true,
  animation: "scale",
  appendTo: document.body,
  hideOnClick: false,
  onMount(instance) {
    // Initialize language menu tippy on the AI Fill button
    tippy(instance.popper.querySelector(".ai-fill-button"), {
      content: createLanguageMenu(),
      // trigger: "mouseenter",
      trigger: "click",
      hideOnClick: false,
      placement: "right-start",
      theme: "light",
      arrow: true,
      interactive: true,
      animation: "scale",
      appendTo: document.body,
      delay: [0, 200], // No delay on show, small delay on hide
      onShow(instance) {
        // Ensure main tippy stays visible while language menu is open
        instance._mainVisible = true;
      },
      onHide(instance) {
        instance._mainVisible = false;
        // Small delay to allow clicking menu items
        setTimeout(() => {
          if (!instance._mainVisible) {
            mainTippy.hide();
          }
        }, 100);
      },
    });
  },
});

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
    if (target.isContentEditable) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        lastSelectionRange = selection.getRangeAt(0).cloneRange();
      }
    }

    // Get cursor position
    let rect;
    if (target.isContentEditable) {
      rect = lastSelectionRange.getBoundingClientRect();
    } else {
      // For input/textarea, use the element's position
      rect = target.getBoundingClientRect();
      const caretPos = target.selectionStart;
      // Create a temporary element to measure text width
      const temp = document.createElement("div");
      temp.style.position = "absolute";
      temp.style.visibility = "hidden";
      temp.style.whiteSpace = "pre";
      temp.style.font = window.getComputedStyle(target).font;
      temp.textContent = target.value.substring(0, caretPos);
      document.body.appendChild(temp);
      const textWidth = temp.getBoundingClientRect().width;
      document.body.removeChild(temp);
      rect = {
        top: rect.top,
        left: rect.left + textWidth,
        bottom: rect.bottom,
        right: rect.left + textWidth,
      };
    }

    // Show main tippy above the cursor position
    mainTippy.setProps({
      getReferenceClientRect: () => ({
        width: 0,
        height: 0,
        top: rect.top + window.scrollY,
        bottom: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.left + window.scrollX,
      }),
    });
    mainTippy.show();
  } else {
    // Hide when clicking elsewhere
    if (!e.target.closest(".tippy-box")) {
      mainTippy.hide();
    }
  }
});

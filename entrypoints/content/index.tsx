import ReactDOM from "react-dom/client";
import { Popup } from "@/components/Popup.tsx";
import { Menu, MenuItem } from "@/components/DropdownMenu.tsx";
import { LANGUAGES } from "@/data";
import { capitalize } from "@/utils/capitalize";
import "@/components/styles.css";

function isInputElement(
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement {
  if (!element) {
    return false;
  }

  return element.tagName === "INPUT" || element.tagName === "TEXTAREA";
}

function isContentEditableElement(
  element: Element | null
): element is HTMLElement {
  if (!element) {
    return false;
  }

  return (element as HTMLElement).isContentEditable;
}

export default defineContentScript({
  matches: ["<all_urls>"],

  main(ctx) {
    let lastActiveElement: HTMLElement | null = null;

    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "fillContent") {
        if (lastActiveElement) {
          const activeElement = lastActiveElement;

          if (isInputElement(activeElement)) {
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
          } else if (isContentEditableElement(activeElement)) {
            activeElement.append(message.content);
          }
        } else {
          const activeElement = document.activeElement;

          if (!activeElement) {
            return;
          }

          if (isInputElement(activeElement)) {
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
      }
    });

    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container);

        const ContentApp = () => {
          const languagesToShow = LANGUAGES;

          return (
            <Popup
              onPopupOpen={(element) => {
                lastActiveElement = element;
              }}
            >
              <Menu
                node={
                  <div>
                    <button className="FillButton">Fill</button>
                  </div>
                }
              >
                {languagesToShow.map((language) => (
                  <MenuItem
                    node={<div key={language}>{capitalize(language)}</div>}
                    onClick={() => {
                      // Send message to background script to get random content
                      browser.runtime.sendMessage({
                        action: "requestContent",
                        language: language,
                      });
                    }}
                  />
                ))}
              </Menu>
            </Popup>
          );
        };

        root.render(<ContentApp />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});

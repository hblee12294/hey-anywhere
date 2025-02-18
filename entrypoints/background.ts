import { LANGUAGES } from "@/data";
import type { Language } from "@/types";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "say_hey",
      title: "Hey",
      contexts: ["editable"],
    });

    LANGUAGES.forEach((lang) => {
      chrome.contextMenus.create({
        id: `hey_${lang}`,
        parentId: "say_hey",
        title: lang.charAt(0).toUpperCase() + lang.slice(1),
        contexts: ["editable"],
      });
    });
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const menuItemId = info.menuItemId;

    if (typeof menuItemId !== "string") {
      return;
    }

    if (menuItemId.startsWith("hey_")) {
      const language = menuItemId.replace("hey_", "") as Language;
      const randomContent = getRandomContent(language);

      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "fillContent",
          content: randomContent,
        });
      }
    }
  });

  // Handle button click from content script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "requestContent" && sender.tab?.id) {
      const randomContent = getRandomContent(message.language);

      chrome.tabs.sendMessage(sender.tab.id, {
        action: "fillContent",
        content: randomContent,
      });
    }
  });
});

import { languages, content } from "./config.js";

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu item
  chrome.contextMenus.create({
    id: "say_hey",
    title: "Hey",
    contexts: ["editable"],
  });

  // Create language submenu items
  languages.forEach((lang) => {
    chrome.contextMenus.create({
      id: `hey_${lang}`,
      parentId: "say_hey",
      title: lang.charAt(0).toUpperCase() + lang.slice(1),
      contexts: ["editable"],
    });
  });
});

// Function to get random content for a language
function getRandomContent(language) {
  const languageContent = content[language.toLowerCase()];
  return languageContent[Math.floor(Math.random() * languageContent.length)];
}

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("hey_")) {
    const language = info.menuItemId.replace("hey_", "");
    const randomContent = getRandomContent(language);

    chrome.tabs.sendMessage(tab.id, {
      action: "fillContent",
      content: randomContent,
    });
  }
});

// Handle button click from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "requestContent") {
    const randomContent = getRandomContent(message.language);

    chrome.tabs.sendMessage(sender.tab.id, {
      action: "fillContent",
      content: randomContent,
    });
  }
});

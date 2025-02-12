import { content } from "../config.js";

// Function to get random content for a language
export function getRandomContent(language) {
  const languageContent = content[language.toLowerCase()];
  return languageContent[Math.floor(Math.random() * languageContent.length)];
}

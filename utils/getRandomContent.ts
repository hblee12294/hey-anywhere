import { DICT } from "@/data";
import { Language } from "@/types";

// Function to get random content for a language
export function getRandomContent(language: Language) {
  const languageContent = DICT[language];

  return languageContent[Math.floor(Math.random() * languageContent.length)];
}

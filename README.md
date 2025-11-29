# Hey Fill

A Chrome/Firefox extension that helps you quickly fill input fields, textareas, and contenteditable elements with inspiring quotes in multiple languages. Access quotes via long-press or right-click context menu.

## ✨ Features

- **🖱️ Long-Press Interaction**: Press and hold (500ms) on any editable field to show a popup menu with language options
- **📋 Context Menu Integration**: Right-click on editable fields to access quotes through the context menu
- **⚙️ Customizable Settings**: Toggle the long-press feature on/off via the extension popup
- **🌍 Multi-language Support**: Choose from 6 languages:
  - English
  - Chinese (中文)
  - Japanese (日本語)
  - German (Deutsch)
  - French (Français)
  - Arabic (العربية)
- **💬 Inspiring Content**: Each language contains a curated collection of motivational quotes
- **✨ Smart Auto-close**: Popup automatically closes after selecting a language
- **🎯 Universal Compatibility**: Works on any input field, textarea, or contenteditable element across all websites

## 📖 Usage

### Method 1: Long-Press (Default)

1. Navigate to any webpage with an input field, textarea, or contenteditable element
2. Press and hold on the field for 500ms
3. A popup menu with a "Fill" button will appear
4. Click the "Fill" button to see available languages
5. Select your preferred language
6. A random inspiring quote in that language will be inserted at your cursor position

### Method 2: Context Menu

1. Right-click on any editable field
2. Hover over "Hey" in the context menu
3. Select your preferred language from the submenu
4. A random quote will be inserted immediately

### Settings

- Click the extension icon in your browser toolbar
- Toggle "Enable Long Press" on or off based on your preference
- The context menu remains available regardless of this setting

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hey-fill

# Install dependencies
pnpm install
```

### Development Mode

```bash
# Run development server for Chrome
pnpm run dev

# Run development server for Firefox
pnpm run dev:firefox
```

After running the dev command:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory from the project

For Firefox:

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `.output/firefox-mv2` directory

### Type Checking

```bash
# Run TypeScript type checking
pnpm run compile
```

## 📦 Build & Deployment

### Production Build

```bash
# Build for Chrome
pnpm run build

# Build for Firefox
pnpm run build:firefox
```

### Create Distribution Package

```bash
# Create zip file for Chrome Web Store
pnpm run zip

# Create zip file for Firefox Add-ons
pnpm run zip:firefox
```

The zip files will be created in the `.output` directory and can be uploaded to respective browser extension stores.

## 🔧 Technical Stack

- **Framework**: [WXT](https://wxt.dev/) - Next-gen web extension framework
- **UI Library**: React 19
- **Language**: TypeScript
- **UI Components**: [@floating-ui/react](https://floating-ui.com/) - Floating popups and menus
- **Storage**: WXT Storage API for persistent settings
- **Build Tool**: WXT (built on Vite)

## 📁 Project Structure

```
hey-fill/
├── components/          # React components (Popup, DropdownMenu)
├── data/               # Language content dictionary
├── entrypoints/        # Extension entry points
│   ├── background.ts   # Background service worker
│   ├── content/        # Content script
│   └── popup/          # Extension popup UI
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── public/             # Static assets (icons)
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is private and not currently licensed for public distribution.

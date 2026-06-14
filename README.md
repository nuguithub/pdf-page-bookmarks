# PDF Page Bookmarks

A lightweight, Manifest V3 Chrome Extension to save, manage, and instantly jump to specific page bookmarks in PDF documents with a minimal monochrome UI.

### Key Highlights
* **Auto-Detection:** Automatically extracts the PDF filename directly from your active browser tab.
* **Full CRUD Operations:** Effortlessly save, view, update, or delete individual page bookmarks.
* **Persistent Local Storage:** Uses `chrome.storage.local` to keep your data safe and private on your machine.
* **Zero Bloat:** Pure, native JavaScript with no heavy external framework dependencies.

## Features

- Automatically detects PDF filename from the current tab.
- Save page bookmarks.
- View all saved bookmarks.
- Update page numbers.
- Delete individual bookmarks.
- Delete all bookmarks.
- Persistent storage using chrome.storage.local.
- Minimal monochrome UI.

---

## Installation

1. Download ZIP

2. Extract files

3. Open Browser.

4. Go to:

   chrome://extensions/

5. Enable:

   Developer Mode

6. Click:

   Load Unpacked

7. Select the extracted folder.

---

## Usage

1. Open any PDF in Browser.
2. Click the extension icon.
3. The PDF filename will automatically appear.
4. Enter a page number.
5. Click Save.
6. Existing bookmarks can be:
   - Updated
   - Deleted
7. Click Delete All to clear storage.

---

## Storage Format

Bookmarks are stored as:

```json
[
  {
    "id": 1712345678901,
    "title": "MyDocument",
    "page": 25
  }
]
```

- `id` = timestamp
- `title` = PDF filename
- `page` = bookmarked page

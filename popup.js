const titleInput = document.getElementById("title");
const pageInput = document.getElementById("page");
const form = document.getElementById("bookmarkForm");
const list = document.getElementById("bookmarks");
const clearAllBtn = document.getElementById("clearAll");

let currentTitle = "";

async function getPdfTitle() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab) return "Unknown PDF";

  let title = tab.title || "";

  if (title.endsWith(".pdf") || tab.url?.includes(".pdf")) {
    currentTitle = title.replace(/\.pdf$/i, "");
    titleInput.value = currentTitle;
    return;
  }

  try {
    const url = new URL(tab.url);
    const file = decodeURIComponent(url.pathname.split("/").pop() || "PDF");

    currentTitle = file.replace(/\.pdf$/i, "");
    titleInput.value = currentTitle;
  } catch {
    currentTitle = "PDF";
    titleInput.value = currentTitle;
  }
}

function getBookmarks() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["bookmarks"], (data) => {
      resolve(data.bookmarks || []);
    });
  });
}

function saveBookmarks(bookmarks) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ bookmarks }, resolve);
  });
}

async function renderBookmarks() {
  const bookmarks = await getBookmarks();

  list.innerHTML = "";

  if (!bookmarks.length) {
    list.innerHTML = "<small>No bookmarks saved.</small>";
    return;
  }

  bookmarks.forEach((bookmark) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <a href="#" class="open-bookmark">${bookmark.title}</a>
      <small>Page ${bookmark.page}</small>

      <div class="row">
        <input type="number" min="1" value="${bookmark.page}">
        <button class="update">Update</button>
        <button class="delete">Delete</button>
      </div>
    `;

    const input = div.querySelector("input");

    div.querySelector(".update").onclick = async () => {
      const updated = bookmarks.map((item) =>
        item.id === bookmark.id
          ? { ...item, page: Number(input.value) || item.page }
          : item,
      );

      await saveBookmarks(updated);
      renderBookmarks();
    };

    div.querySelector(".delete").onclick = async () => {
      const updated = bookmarks.filter((item) => item.id !== bookmark.id);

      await saveBookmarks(updated);
      renderBookmarks();
    };

    div.querySelector(".open-bookmark").onclick = (e) => {
      e.preventDefault();

      chrome.tabs.create({
        url: `${bookmark.url}#page=${bookmark.page}`,
      });
    };

    list.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const page = Number(pageInput.value);

  if (!page) return;

  const bookmarks = await getBookmarks();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  bookmarks.unshift({
    id: Date.now(),
    title: currentTitle || "PDF",
    page,
    url: tab.url,
  });

  await saveBookmarks(bookmarks);

  pageInput.value = "";
  renderBookmarks();
});

clearAllBtn.addEventListener("click", async () => {
  chrome.storage.local.remove("bookmarks", () => {
    renderBookmarks();
  });
});

(async () => {
  await getPdfTitle();
  renderBookmarks();
})();

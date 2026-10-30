const emojiGrid = document.getElementById("emojiGrid");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsTitle = document.getElementById("resultsTitle");
const resultsSubtitle = document.getElementById("resultsSubtitle");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

let allEmojis = [];

function createEmojiCard(item) {
  const aliases = item.aliases.join(", ");
  const tags = item.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join("");

  return `
    <div class="emoji-card" data-emoji="${item.emoji}">
      <div class="emoji-symbol">${item.emoji}</div>
      <div class="emoji-name">${item.description}</div>
      <div class="emoji-alias">${aliases}</div>
      <div class="emoji-tags">${tags}</div>
    </div>
  `;
}

function renderEmojis(list) {
  emojiGrid.innerHTML = list.map(createEmojiCard).join("");
  emptyState.classList.toggle("hidden", list.length !== 0);

  if (searchInput.value.trim() === "") {
    resultsTitle.textContent = "All Emojis";
    resultsSubtitle.textContent = `Showing ${list.length} emojis`;
  } else {
    resultsTitle.textContent = "Search Results";
    resultsSubtitle.textContent = `Found ${list.length} matching emojis`;
  }
}

function filterEmojis() {
  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    renderEmojis(allEmojis);
    return;
  }

  const filtered = allEmojis.filter(item => {
    const fullText = `${item.description} ${item.aliases.join(" ")} ${item.tags.join(" ")}`.toLowerCase();
    return fullText.includes(query);
  });

  renderEmojis(filtered);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1200);
}

function loadEmojis() {
  allEmojis = emojiList;
  renderEmojis(allEmojis);
}

searchInput.addEventListener("input", filterEmojis);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderEmojis(allEmojis);
  searchInput.focus();
});

emojiGrid.addEventListener("click", async (e) => {
  const card = e.target.closest(".emoji-card");
  if (!card) return;

  const emoji = card.dataset.emoji;

  try {
    await navigator.clipboard.writeText(emoji);
    showToast(`Copied ${emoji}`);
  } catch {
    showToast(emoji);
  }
});

window.addEventListener("DOMContentLoaded", loadEmojis);
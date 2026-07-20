// script.js — KIKO frontend

const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const ageTabs = document.getElementById("ageTabs");
const chipsRow = document.getElementById("chipsRow");
const newChatBtn = document.getElementById("newChatBtn");

const SESSION_ID = "kiko-" + Math.random().toString(36).slice(2, 10);

let currentAge = "creator";

const SUGGESTIONS = {
  explorer: ["What is coding?", "What is Scratch?", "Can we make a game?", "Why do computers need code?"],
  builder: ["Teach me Python", "Build a calculator", "Make a website", "What is JavaScript?"],
  creator: ["Build a portfolio", "Learn React", "Create an API", "Learn AI"],
  mentor: ["System Design", "DSA interview", "Backend roadmap", "Machine Learning"],
};

/* ---------------- Age tabs ---------------- */
ageTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".age-tab");
  if (!btn) return;
  document.querySelectorAll(".age-tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  currentAge = btn.dataset.age;
  renderChips();
});

function renderChips() {
  chipsRow.innerHTML = "";
  SUGGESTIONS[currentAge].forEach((text) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = text;
    chip.addEventListener("click", () => {
      chatInput.value = text;
      chatForm.requestSubmit();
    });
    chipsRow.appendChild(chip);
  });
}
renderChips();

/* ---------------- New chat ---------------- */
newChatBtn.addEventListener("click", async () => {
  try {
    await fetch("/api/chat/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: SESSION_ID }),
    });
  } catch (_) {}
  chatWindow.innerHTML = "";
  addMessage(
    "kiko",
    "Fresh start! 🌟 What would you like to learn or build today?"
  );
});

/* ---------------- Sending messages ---------------- */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage("user", escapeHtml(text));
  chatInput.value = "";
  sendBtn.disabled = true;

  const typingEl = addTypingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, ageGroup: currentAge, sessionId: SESSION_ID }),
    });
    const data = await res.json();
    typingEl.remove();

    if (!res.ok) {
      addMessage("kiko", `😕 ${escapeHtml(data.error || "Something went wrong.")}`);
    } else {
      const bubble = addMessage("kiko", "");
      await typeOutReply(bubble, data.reply);
    }
  } catch (err) {
    typingEl.remove();
    addMessage("kiko", "😕 I couldn't reach the server. Is it running?");
  } finally {
    sendBtn.disabled = false;
    chatInput.focus();
  }
});

/* ---------------- Rendering helpers ---------------- */
function addMessage(sender, htmlContent) {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = sender === "user" ? "🧑" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerHTML = htmlContent ? `<p>${htmlContent}</p>` : "";

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  scrollToBottom();
  return bubble;
}

function addTypingIndicator() {
  const msg = document.createElement("div");
  msg.className = "msg kiko";
  msg.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  chatWindow.appendChild(msg);
  scrollToBottom();
  return msg;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Render markdown-ish text (code fences) into safe HTML with copy buttons,
   then reveal it with a light typing animation. */
async function typeOutReply(bubbleEl, rawText) {
  const rendered = renderContent(rawText);
  bubbleEl.innerHTML = "";

  // Type out plain text fast (char-by-char feels slow on long replies,
  // so we reveal in small chunks for a lively but quick typing effect).
  const container = document.createElement("div");
  bubbleEl.appendChild(container);
  container.innerHTML = rendered;

  // Fade lines in progressively for a "typing" feel without being slow.
  const blocks = container.querySelectorAll(":scope > *");
  blocks.forEach((el) => (el.style.opacity = "0"));
  for (const el of blocks) {
    el.style.transition = "opacity 0.25s ease";
    el.style.opacity = "1";
    scrollToBottom();
    await sleep(90);
  }

  attachCopyButtons(bubbleEl);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function renderContent(text) {
  // Split on fenced code blocks ```lang\ncode```
  const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
  let html = "";
  for (let i = 0; i < parts.length; i += 3) {
    const textChunk = parts[i];
    if (textChunk) html += paragraphize(textChunk);

    const lang = parts[i + 1];
    const code = parts[i + 2];
    if (code !== undefined) {
      html += `
        <div class="code-block">
          <div class="code-lang">
            <span>${escapeHtml(lang || "code")}</span>
            <button class="copy-btn" type="button">Copy</button>
          </div>
          <pre><code>${escapeHtml(code.trim())}</code></pre>
        </div>`;
    }
  }
  return html;
}

function paragraphize(text) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function attachCopyButtons(scope) {
  scope.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.closest(".code-block").querySelector("code").textContent;
      navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied! ✓";
        setTimeout(() => (btn.textContent = original), 1500);
      });
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

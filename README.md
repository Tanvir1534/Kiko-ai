# KIKO — Your Cheerful Coding Buddy 🤖

A lightweight AI coding tutor for ages 5–18+, running entirely on your machine with a
local Ollama model. No API keys, no monthly bills.

---

## 1. Install Node.js (skip if already installed)

1. Go to https://nodejs.org and download the **LTS** version for your OS.
2. Run the installer, accepting the defaults.
3. Verify it worked — open a terminal (in VS Code: **Terminal → New Terminal**) and run:
   ```bash
   node -v
   npm -v
   ```
   You should see version numbers for both.

## 2. Install Ollama (the free local AI engine)

1. Go to https://ollama.com/download and install it for your OS.
2. Once installed, Ollama runs a small background service automatically.
3. Pull a model to power KIKO (this only needs to happen once). A good default:
   ```bash
   ollama pull llama3.1
   ```
   This downloads a few GB, so it may take a while depending on your internet speed.
   Lighter options if your computer is older/slower:
   ```bash
   ollama pull llama3.2:3b
   ```
   (If you use a different model name, remember it — you'll set it in Step 4.)
4. Confirm Ollama is running:
   ```bash
   ollama list
   ```
   You should see your pulled model in the list.

## 3. Open the KIKO project in VS Code

1. Unzip the `KIKO.zip` file you downloaded.
2. In VS Code: **File → Open Folder…** → select the unzipped `KIKO` folder.
3. You should see this structure in the Explorer panel:
   ```
   KIKO/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── server.js
   ├── package.json
   ├── prompts/
   │   └── system.js
   ├── routes/
   │   └── chat.js
   └── assets/
   ```

## 4. Install project dependencies

Open a terminal inside VS Code (**Terminal → New Terminal**), make sure you're inside
the `KIKO` folder, then run:
```bash
npm install
```
This installs Express and CORS (the only two dependencies).

### Optional: point KIKO at a different model or port
By default KIKO uses model `llama3.1` on `http://localhost:11434`. To change this,
create a file named `.env`... actually KIKO reads plain environment variables, so
instead just run it like this (only if you need to override the default):
```bash
# macOS / Linux
OLLAMA_MODEL=llama3.2:3b PORT=3000 npm start

# Windows PowerShell
$env:OLLAMA_MODEL="llama3.2:3b"; $env:PORT="3000"; npm start
```
If you pulled `llama3.1` and are happy with port `3000`, just skip this and use Step 5.

## 5. Run KIKO

Make sure Ollama is running in the background (it usually starts automatically after
installation; if not, run `ollama serve` in a separate terminal), then:
```bash
npm start
```
You should see:
```
🤖 KIKO is awake! Open http://localhost:3000 in your browser.
```

## 6. Open KIKO

Open your browser and go to:
```
http://localhost:3000
```
Pick an age mode (Explorer, Builder, Creator, or Mentor), tap a suggested question or
type your own, and start learning!

---

## How it works

- **Frontend** (`index.html`, `style.css`, `script.js`) — a chat interface with age
  tabs, suggested-question chips, a typing animation, and copy buttons on code blocks.
- **Backend** (`server.js`, `routes/chat.js`) — a small Express server that forwards
  your message (plus the current conversation) to your local Ollama model.
- **Teaching personality** (`prompts/system.js`) — a system prompt that changes tone,
  vocabulary, and code complexity based on the selected age mode, and always follows
  a "hook → explain → example → challenge" teaching structure.
- **Memory** — KIKO remembers the current conversation per browser session (stored in
  server memory, keyed by a random session ID generated in `script.js`). Click
  **✨ New chat** to clear it, or just restart the server.

## Troubleshooting

| Problem | Fix |
|---|---|
| "KIKO couldn't reach the local AI model" | Run `ollama serve` in a terminal, and confirm `ollama list` shows your model. |
| `npm start` fails immediately | Run `npm install` again inside the `KIKO` folder. |
| Port 3000 already in use | Run with `PORT=3001 npm start` (or the PowerShell equivalent), then visit `http://localhost:3001`. |
| Replies are slow | Try a smaller model, e.g. `ollama pull llama3.2:3b`, then set `OLLAMA_MODEL=llama3.2:3b`. |

## Customizing KIKO

- **Change the teaching voice** → edit `prompts/system.js`.
- **Add/change suggested questions** → edit the `SUGGESTIONS` object in `script.js`.
- **Change colors/fonts** → edit the `:root` variables at the top of `style.css`.
- **Swap the mascot** → replace the inline SVG in `index.html` with your own artwork.

## Optional: sharing KIKO on your local network

To let another device on your Wi-Fi (like a tablet) use KIKO, find your computer's
local IP address (e.g. `192.168.1.42`) and visit `http://<that-ip>:3000` from the other
device — both devices need to be on the same network, and your computer's firewall
must allow inbound connections on the port.

Have fun building with KIKO! 🎉

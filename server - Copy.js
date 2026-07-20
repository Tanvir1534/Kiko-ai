require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const chatRouter = require("./routes/chat");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.use("/api", chatRouter);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "KIKO",
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🤖 KIKO running at http://localhost:${PORT}`);
});
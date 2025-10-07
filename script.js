// script.js
// Uses twitch-proxy.freecodecamp.rocks to query Twitch info without API key.

const users = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas"
];

const base = "https://twitch-proxy.freecodecamp.rocks/twitch-api";
const streamsContainer = document.getElementById("streams");

const showAllBtn = document.getElementById("show-all");
const showOnlineBtn = document.getElementById("show-online");
const showOfflineBtn = document.getElementById("show-offline");

// store DOM nodes for filtering
const rowNodes = [];

// helper to create element
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const k in attrs) {
    if (k === "className") node.className = attrs[k];
    else if (k === "html") node.innerHTML = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  children.flat().forEach(c => {
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else if (c) node.appendChild(c);
  });
  return node;
}

// fetch info for a single user
async function fetchUser(user) {
  const channelURL = `${base}/channels/${user}`;
  const streamURL = `${base}/streams/${user}`;

  // default placeholders
  let channel = null;
  let stream = null;
  try {
    const [chResp, stResp] = await Promise.all([
      fetch(channelURL).then(r => r.json()),
      fetch(streamURL).then(r => r.json())
    ]);
    channel = chResp;
    stream = stResp;
  } catch (err) {
    console.error("Fetch error", err);
  }
  return { channel, stream };
}

// render a row given channel & stream responses
function renderRow(user, channel, stream) {
  // row clickable -> open channel url
  const link = (channel && channel.url) ? channel.url : `https://www.twitch.tv/${user}`;
  const row = el("div", { className: "stream", role: "button", tabIndex: 0 });
  row.addEventListener("click", () => window.open(link, "_blank", "noopener"));

  // logo
  const logo = el("div", { className: "logo" });
  const logoImg = el("img");
  logoImg.src = (channel && channel.logo) ? channel.logo : "https://static-cdn.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_purple.png";
  logo.appendChild(logoImg);

  // content
  const content = el("div", { className: "content" });
  const title = el("h3", { className: "title" }, channel && channel.display_name ? channel.display_name : user);
  const statusText = (channel && channel.status) ? channel.status : "";
  const top = el("div", { className: "top" },
    el("div", {}, title, el("div", { className: "status" }, statusText ? ` — ${statusText}` : "")),
    // badge: online/offline/closed
    el("div", {}, (stream && stream.stream) ? el("span", { className: "badge online" }, "ONLINE")
                                  : (channel && channel.error) ? el("span", { className: "badge closed" }, "CLOSED")
                                  : el("span", { className: "badge offline" }, "OFFLINE"))
  );

  content.appendChild(top);

  // when streaming, show extra details
  if (stream && stream.stream) {
    const s = stream.stream;
    const game = s.game || "";
    const viewers = s.viewers || 0;
    const previewUrl = s.preview ? s.preview.medium : null;

    const details = el("div", { className: "details" },
      el("div", { className: "meta" }, `Playing: ${game}`),
      el("div", { className: "meta" }, `Viewers: ${viewers}`)
    );

    if (previewUrl) {
      const preview = el("div", { className: "preview" }, el("img", { src: previewUrl }));
      content.appendChild(details);
      content.appendChild(preview);
    } else {
      content.appendChild(details);
    }
  } else {
    // Offline: show last known description if any
    if (channel && channel.status) {
      content.appendChild(el("p", { className: "status-line" }, channel.status));
    }
  }

  row.appendChild(logo);
  row.appendChild(content);

  streamsContainer.appendChild(row);
  // store metadata for filtering
  rowNodes.push({
    node: row,
    user,
    online: !!(stream && stream.stream),
    closed: !!(channel && channel.error)
  });
}

// main runner
async function loadAll() {
  streamsContainer.innerHTML = "";
  rowNodes.length = 0;
  // show placeholder
  streamsContainer.appendChild(el("p", { className: "loading" }, "Loading..."));

  const promises = users.map(u => fetchUser(u));
  const results = await Promise.all(promises);

  streamsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { channel, stream } = results[i] || {};
    renderRow(user, channel, stream);
  }
}

// filters
function setFilter(mode) {
  // mode: 'all'|'online'|'offline'
  rowNodes.forEach(r => {
    if (mode === "all") r.node.style.display = "";
    else if (mode === "online") r.node.style.display = r.online ? "" : "none";
    else if (mode === "offline") r.node.style.display = (!r.online && !r.closed) ? "" : "none";
  });
  // update active class on buttons
  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  if (mode === "all") showAllBtn.classList.add("active");
  if (mode === "online") showOnlineBtn.classList.add("active");
  if (mode === "offline") showOfflineBtn.classList.add("active");
}

showAllBtn.addEventListener("click", () => setFilter("all"));
showOnlineBtn.addEventListener("click", () => setFilter("online"));
showOfflineBtn.addEventListener("click", () => setFilter("offline"));

// init
loadAll();

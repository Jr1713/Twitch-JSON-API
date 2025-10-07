# Twitch Streamers / Twitch JSON API 🎮📺

Displays a list of Twitch streamers and their online status using a proxy API.  
Live demo: [Twitch JSON API by jr-delfin](https://codepen.io/jr-delfin/pen/myVRzag) :contentReference[oaicite:0]{index=0}

---

## Table of Contents

1. What This Does  
2. Tools & Technologies Used  
3. How It Works  
4. API / Data Source  

---

## 1. What This Does

This project shows a list of pre-defined Twitch users and whether they are:

- Online (streaming)  
- Offline  
- Closed / not found  

You can filter the list by **All / Online / Offline**.  
Clicking a streamer’s row opens their Twitch channel.  
Streamers that are online also show extra info like game being played, viewer count, and a preview image.

---

## 2. Tools & Technologies Used

- **HTML5** — for structure and layout :contentReference[oaicite:1]{index=1}  
- **CSS3** — styling, theming, layout, responsive design :contentReference[oaicite:2]{index=2}  
- **JavaScript (ES6+)** — for fetching data, creating DOM elements, filtering logic :contentReference[oaicite:3]{index=3}  

No frameworks or libraries are used — everything is vanilla JS, HTML, and CSS.

---

## 3. How It Works

1. **User List**  
   A fixed array of Twitch usernames (e.g. `["ESL_SC2", "OgamingSC2", "freecodecamp", ...]`) is defined. :contentReference[oaicite:4]{index=4}  

2. **Fetching Data**  
   For each user in that list, two API endpoints are fetched (via the proxy):

   - `/channels/{user}` → fetch channel info  
   - `/streams/{user}` → fetch stream (live) info  

   These fetches are done in parallel using `Promise.all`. :contentReference[oaicite:5]{index=5}  

3. **Rendering Rows**  
   For each user, a “row” element is created with:
   - Their logo / avatar  
   - Display name  
   - Status badge: **Online**, **Offline**, or **Closed**  
   - If **Online**, more details: game, viewers, preview image  
   - The row is clickable (opens Twitch channel)  
   - Each row’s DOM node and metadata (online / closed status) is stored for filtering later :contentReference[oaicite:6]{index=6}  

4. **Filtering**  
   There are three filter buttons: **All**, **Online**, **Offline**.  
   Clicking a filter hides or shows rows depending on their status.  
   The active filter button is visually marked. :contentReference[oaicite:7]{index=7}  

5. **Error Handling / Fallbacks**  
   - If fetch fails or user doesn't exist, show as “Closed”  
   - Use default icons / placeholders when data is missing  
   - Catch fetch errors and log to console :contentReference[oaicite:8]{index=8}  

---

## 4. API / Data Source

This project uses the **FreeCodeCamp Twitch Proxy API** to get around CORS and rate limits, so you don’t need API keys. :contentReference[oaicite:9]{index=9}

Base URL used:

https://twitch-proxy.freecodecamp.rocks/twitch-api

Endpoints example:

- `https://.../channels/{username}`  
- `https://.../streams/{username}`  

These return JSON objects with channel and stream data.

<div align="center">

# 📻 Yaadon Ki Duniya (यादों की दुनिया)
### *A Retro Nostalgic Ambient Audio & Music Experience*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.org/)
[![Songs](https://img.shields.io/badge/Curated_Songs-700+_Tracks-FF4081?style=for-the-badge&logo=music&logoColor=white)](#-music-dataset--curated-playlists)
[![Algorithm](https://img.shields.io/badge/Radio_Engine-2:1_Interleaved-FF9800?style=for-the-badge&logo=radio&logoColor=white)](#-21-interleaved-radio-algorithm)
[![License](https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge)](LICENSE)

<br />

![Yaadon Ki Duniya Banner](./public/images/hero.jpg)

<br />

**Yaadon Ki Duniya** is an immersive, high-aesthetic web application designed to transport you back into the golden era of 90s & 2000s India. Featuring **6 distinct ambient retro environments**, **700+ handpicked embeddable superhit songs** (Bollywood Classics + Desi Bhojpuri Flashback Gold), a dynamic **2:1 Interleaved Radio Engine**, background audio soundscapes, glassmorphic UI, and continuous audio playback.

</div>

---

## 🌟 Key Highlights & New Features

- 📻 **Dynamic 2:1 Interleaved Radio Engine**: Built-in algorithm that automatically interleaves 2 Bollywood/Hindi Nostalgia tracks with 1 Desi Bhojpuri Hit (`Hindi → Hindi → Bhojpuri → Hindi → Hindi → Bhojpuri...`).
- 🪕 **Global Bhojpuri Flashback Gold Dataset**: 100 classic 90s/2000s Bhojpuri hits (Gayatri Rani, Manoj Tiwari, Radhe Shyam Rasiya cassette classics, Sharda Sinha folk, Pawan Singh, Kalpana) integrated into every scene's playback pool.
- 🏷️ **Live Genre Pills & UI Badges**: Player UI displays real-time genre badges (`🎬 Bollywood` / `🪕 Bhojpuri`) alongside track info.
- 🎛️ **Interactive 2:1 Radio Mode Toggle**: Toggle badge button on the player controller allowing users to switch seamlessly between `2:1 Interleaved Radio Mode` and `Sequential Mode`.
- 🔊 **Dual Audio System**: Environmental background ambient soundscapes (bus engine, rain & tea shop chatter, hair clipper buzz, train platform announcements, evening birds/radio static) combined with active YouTube music playback.
- 🔄 **Smart Fallback Engine**: Automatic error-handling engine that skips un-embeddable or restricted videos seamlessly without interrupting playback.
- 🎨 **Glassmorphism & Vibrant UI**: Dynamic ambient tinting, animated background layers, real-time 10-bar audio visualizer, and dark mode aesthetics.

---

## 🧠 2:1 Interleaved Radio Algorithm

The custom-engineered interleaving engine balances 90s/2000s Bollywood Nostalgia with Desi Bhojpuri Hits throughout continuous playback:

$$\text{Playback Sequence: } [\text{Bollywood}_1, \text{Bollywood}_2, \text{Bhojpuri}_1, \text{Bollywood}_3, \text{Bollywood}_4, \text{Bhojpuri}_2, \dots]$$

### How It Works:
1. **Classification & Tagging**: Every track is dynamically tagged (`category: 'bollywood'` or `'bhojpuri'`) based on metadata & artist catalog.
2. **Interleaved Queue Generation**: The engine splits playlist pools and generates an alternating $2:1$ queue pattern.
3. **Infinite Continuous Flow**: If a pool exhausts during long sessions, the algorithm loops dynamically without breaking the $2:1$ ratio rhythm.

---

## 🖼️ Nostalgic Environments & Scenes

<div align="center">

### 🚌 1. Bus Ka Safar (बस का सफ़र)
*Patna to Nawada Local Bus Journey — Horns, conductor calls, 90s road-trip anthems & Bhojpuri travel hits.*

![Bus Ka Safar](./public/images/travel.jpg)

---

### ✂️ 2. Desi Salon (देसी सैलून)
*Local Barber Shop — Scissors snippet sound, hair clipper buzz, 90s radio hits & Manoj Tiwari / Radhe Shyam Rasiya classics.*

![Desi Salon](./public/images/salon.jpg)

---

### ☕ 3. Chai Tapri (चाय की टपरी)
*Rainy Tea Stall — Sizzling kettle, kulhad chai, pouring rain, and soulful romantic melodies.*

![Chai Tapri](./public/images/chai-tapri.jpg)

---

### 🚂 4. Railway Station (रेलवे स्टेशन)
*Platform 1 Raunak — Chai-garam calls, distant train whistles, long-distance journey ballads & folk melodies.*

![Railway Station](./public/images/railway.jpg)

---

### 🌇 5. Mohalle Ki Shaam (मोहल्ले की शाम)
*Sunset Choupati & Rooftop Hangout — Kids playing cricket, neighborhood chatter & evening nostalgia.*

![Mohalle Ki Shaam](./public/images/mohalla.jpg)

---

### 📻 6. Purana Radio (पुराना रेडियो)
*Binaca Geetmala Era — Vintage MW/FM radio static, classic melodies & timeless golden hits.*

![Purana Radio](./public/images/radio.jpg)

</div>

---

## 🎶 Music Dataset & Curated Playlists

Each environment contains over **100+ tracks** cataloged with track titles, artists, release years, custom artwork, and embeddable YouTube video IDs.

| Scene | Icon | Bollywood Classics | Integrated Bhojpuri Flashback Gold | Total Pool |
|---|---|---|---|---|
| **Bus Ka Safar** | 🚌 | DDLJ, Pardes, Dil Se, Swades, Jab We Met, Tamasha | Gayatri Rani, Manoj Tiwari, Radhe Shyam Rasiya, Sharda Sinha | **120+** |
| **Desi Salon** | ✂️ | Baazigar, Main Khiladi Tu Anari, Coolie No.1, Dulhe Raja | Manoj Tiwari (Rinkiya Ke Papa, Lalki Odhaniya), Radhe Shyam Rasiya | **120+** |
| **Chai Tapri** | ☕ | Aashiqui, Saajan, Dil Chahta Hai, Kal Ho Naa Ho, Tere Naam | Kalpana Patowary, Pawan Singh, Bhojpuri Folk Classics | **120+** |
| **Railway Station** | 🚂 | Parichay, Dost, Highway, Rockstar, Dil Se, Kaho Naa Pyaar Hai | Sharda Sinha, Sunil Chhaila Bihari, Classic Travel Folk | **120+** |
| **Mohalle Ki Shaam** | 🌇 | QSQT, Darr, Dhadkan, Zeher, Murder, RHTDM, KKHH | Khesari Lal, Pawan Singh, Desi Chhath & Folk Hits | **120+** |
| **Purana Radio** | 📻 | Binaca Geetmala 90s Chartbusters, Sadak, Taal, Khalnayak | Vintage Radio Bhojpuri Renditions & Melodies | **120+** |

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.org/)
- **UI & Styling**: Vanilla CSS3 with CSS Custom Properties, Flexbox/Grid, Backdrop Blur Filters, keyframe animations
- **Player API**: Window `YT.Player` iFrame API with event listeners (`onStateChange`, `onError`, `onReady`)

```
Yaadon_Ki_Duniya/
├── public/
│   ├── audio/           # Environmental background ambient MP3 audio loops
│   └── images/          # High-resolution HD artwork and scene banners
├── src/
│   ├── components/
│   │   ├── Player.tsx          # Custom Player with 2:1 Interleaved Mode & Genre Pills
│   │   └── SceneBackground.tsx # Ambient Visuals & Dynamic Particle Filters
│   ├── App.tsx          # Main Application State & Scene Routing
│   ├── data.ts          # 700+ Song Dataset & Interleaving Algorithm Engine
│   ├── main.tsx         # Application Entry Point
│   └── styles.css       # Design System & Token Utilities
├── index.html           # HTML5 Shell with Google Fonts
└── package.json         # Dependencies & Script Scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/indrajitkumar23541-a11y/Yaadon_Ki_Duniya.git
   cd Yaadon_Ki_Duniya
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Launch local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Created with ❤️ for retro 90s nostalgia and timeless Indian melodies.</sub>
</div>

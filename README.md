# 🏎️ Porsche 911 Desert Dash

High-speed desert racing game with realistic physics, mobile optimization, and competitive leaderboards.

## 🎮 Live Game
- **Homepage:** https://porsche.911fund.io
- **Direct Game:** https://porsche.911fund.io/game.html

## 🏗️ Project Structure
```
├── index.html          # Homepage with leaderboards & game showcase
├── game.html           # Main racing game with full features  
├── homepage.html       # Source copy of homepage
├── api/                # Leaderboard server
├── improvement-roadmap.md    # Development phases and plans
├── domain-setup-guide.md     # Deployment and DNS configuration
└── README.md           # This file
```

## ✨ Features

### Homepage
- 🏆 **Top 5 Leaderboard** - See the fastest desert racers
- 🎨 **Animated Graphics** - Desert-themed with floating cacti
- 📱 **Mobile Responsive** - Looks great on all devices
- 🚀 **Smooth Transitions** - Professional user experience

### Game
- 🏎️ **Realistic Porsche 911** - Detailed sprite and physics
- 🏜️ **Dynamic Desert Environment** - Parallax scrolling with particle effects
- ⛽ **Fuel Management** - Strategic resource management
- 💨 **Particle Systems** - Dust, exhaust, explosions, and sparkles
- 📱 **Touch Controls** - Swipe to steer on mobile devices
- 🎯 **Scoring System** - Points for speed and survival time
- 🏆 **Auto-Save Scores** - Persistent leaderboards with localStorage

### Controls
- **Desktop:** Arrow keys or WASD
- **Mobile:** Swipe in any direction
- **Restart:** Space key or tap screen (game over)
- **Homepage:** H key (during game over)

## 🚀 Development

### Contributing
1. Clone repository
2. Make improvements
3. Test locally
4. Deploy:
   - `git add .` 
   - `git commit -m "description"`
   - `git push origin main`

## 🌐 Deployment

### Current Setup
- **Nginx Reverse Proxy** with SSL/HTTPS
- **Rate limiting** and security headers
- **Mobile optimization** for all devices
- **Cloudflare DNS** configuration ready

### Domain Configuration
See `domain-setup-guide.md` for complete setup instructions.

## 📊 Technical Details
- **Framework:** Pure HTML5 Canvas + JavaScript
- **Rendering:** 60 FPS with smooth particle effects
- **Storage:** localStorage for scores and preferences
- **Responsive:** CSS clamp() and viewport units
- **Performance:** Optimized for mobile and desktop

## 🎯 Roadmap
See `improvement-roadmap.md` for detailed development phases and planned features.

---

**Built with ⚡ for 911Fund**

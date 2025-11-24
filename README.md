<div align="center">

<img src="https://talale.it/icon.png" alt="talale.it icon" width="32" height="32" style="vertical-align: middle;">

# talale.it

[![Netlify Status](https://api.netlify.com/api/v1/badges/3185917a-f914-4861-b074-275c43b204ef/deploy-status)](https://app.netlify.com/sites/talale/deploys)
[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

_Personal website & portfolio built with modern web technologies_

[🌐 Live](https://talale.it) • [📝 Report Bug](https://github.com/xTalAlex/talale-astro/issues)

</div>

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Development](#-development)
- [Coding Conventions](#-coding-conventions)
- [Analytics Events](#-analytics-events)
- [Custom Events](#-custom-events)
- [Roadmap](#-roadmap)

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build)
- **UI Components:** Vue.js
- **Styling:** DaisyUI + Custom CSS
- **Analytics:** Google Analytics
- **Deployment:** Netlify
- **Testing:** Vitest, Cypress
- **CMS:** Decap CMS (NetlifyCMS)

## ✨ Features

- 📱 Fully responsive design
- 🎨 Dark/Light theme switching
- 📝 Blog with RSS feed
- 🎮 Interactive mini-games (Minesweeper, Pitch Detection)
- 📻 Web Radio integration
- 🗺️ Interactive map
- 👤 User authentication & profiles
- 💬 Live chat integration (Tawkto)
- 📧 Contact forms with Google Analytics tracking
- 🎯 Nintendo Switch games wishlist & catalog

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run start        # Start development server (alias)
npm run build        # Build for production (remote mode)
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
npm run decap        # Start Decap CMS server
npm run test         # Run unit tests with Vitest
npm run lint         # Lint code with ESLint
npm run prettier     # Format code with Prettier
npm run check        # Check Astro project for errors
```

### Project Structure

```
├── src/
│   ├── components/     # Astro & Vue components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── lib/            # Utilities & helpers
│   ├── config/         # Configuration files
│   └── assets/         # Static assets
├── public/             # Public static files
├── functions/          # Serverless functions
└── test/               # Test files
```

## 📐 Coding Conventions

| Element                          | Convention        | Example         |
| -------------------------------- | ----------------- | --------------- |
| Variables, Functions, Properties | `camelCase`       | `getUserData()` |
| Immutable Constants              | `SNAKE_UPPERCASE` | `API_BASE_URL`  |
| Database Fields                  | `snake_case`      | `user_id`       |
| HTML IDs                         | `kebab-case`      | `user-profile`  |
| JS Events                        | `camelCase`       | `requestLogin`  |

## 📊 Analytics Events

### Google Analytics Events

| Event                      | Description                             | Parameters                                         |
| -------------------------- | --------------------------------------- | -------------------------------------------------- |
| `form_submit`              | Form submission tracking                | `form_name`: `messagebox` \| `tawkto_offline_form` |
| `chat_start`               | Tawkto chat message sent                | -                                                  |
| `calendar_meeting_created` | Google Calendar booking via Zapier      | -                                                  |
| `contact_link_click`       | Contact button clicks (WhatsApp, Email) | Class: `ga-contact-link`                           |
| `game_won`                 | Minesweeper game won                    | -                                                  |
| `game_lost`                | Minesweeper game lost                   | -                                                  |
| `radio_play`               | Radio station played                    | -                                                  |

## 🎯 Custom Events

### JavaScript Events

| Event           | Description                  | Parameters                  |
| --------------- | ---------------------------- | --------------------------- |
| `requestLogin`  | Trigger login flow           | -                           |
| `requestLogout` | Trigger logout flow          | -                           |
| `loggedIn`      | User logged in successfully  | -                           |
| `loggedOut`     | User logged out successfully | -                           |
| `openModal`     | Open modal dialog            | `title`, `body`, `image`    |
| `notify`        | Show notification            | `title`, `message`, `style` |
| `tawktoLoaded`  | Tawto script loaded          | -                           |

## 🗺️ Roadmap

- [ ] **eBay API Integration** - Display product listings
- [ ] **Services CTA Upgrade** - Enhanced call-to-action components
- [ ] **E-commerce Template** - Integration with Crystallize
- [ ] **Test Coverage** - Improve npm test coverage
- [ ] **Throttling wishlist DB operations** - Avoid DB calls spam

---

<div align="center">

Made by [xTalAlex](https://github.com/xTalAlex)

</div>

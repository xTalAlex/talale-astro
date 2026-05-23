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
- [Content Management](#-content-management)
- [Analytics Events](#-analytics-events)
- [Custom Events](#-custom-events)
- [Roadmap](#-roadmap)
- [Known Issues](#-known-issues)

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build)
- **UI Components:** Vue.js
- **Styling:** DaisyUI + Custom CSS
- **Auth:** [Better Auth](https://better-auth.com) (Email/Password, Google OAuth)
- **ORM:** [Prisma](https://www.prisma.io) (PostgreSQL)
- **Email:** [Mailtrap](https://mailtrap.io)
- **Analytics:** Google Analytics
- **Deployment:** Netlify
- **Testing:** Vitest, Cypress
- **Headless CMS:** [Keystatic](https://keystatic.com) — local + GitHub-backed content editing via [`keystatic.config.tsx`](./keystatic.config.tsx), mounted at `/keystatic`

## ✨ Features

- 📱 Fully responsive design
- 🎨 Dark/Light theme switching
- 📝 Blog with RSS feed
- 🎮 Interactive mini-games (Minesweeper, Pitch Detection)
- 📻 Web Radio integration
- 🗺️ Interactive map
- 👤 User authentication & profiles (email/password, Google OAuth)
- 🔑 Password reset flow
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
npm run prisma       # Run Prisma CLI commands
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
├── prisma/             # Prisma schema & migrations
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

## � Content Management

Long-form content (projects, site settings, ads, LLM context) is managed through [Keystatic](https://keystatic.com), mounted as an Astro integration and accessible at [`/keystatic`](http://localhost:4321/keystatic) during local development.

- **Configuration:** [`keystatic.config.tsx`](./keystatic.config.tsx) defines collections (`projects`) and singletons (`general`, `freelance`, `llmsContext`, `ads`).
- **Storage:**
  - Local (`kind: "local"`) in development — edits write directly to files under `src/content/` and `src/config/`.
  - GitHub (`kind: "github"`) in production — edits open commits/PRs against `xTalAlex/talale-astro`.
- **Media:** uploads are written to `public/uploads/` and referenced via `/uploads/...` public paths.
- **Authoring formats:** project bodies use Markdown (`format: { contentField: "content" }`); structured fields use Keystatic's typed fields API.

See [Known Issues → Keystatic Limitations](#keystatic-limitations) for current caveats.

## �📊 Analytics Events

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

| Event                       | Description                    | Parameters                             |
| --------------------------- | ------------------------------ | -------------------------------------- |
| `requestLogin`              | Trigger login flow             | -                                      |
| `attemptLogin`              | Attempt login with credentials | `method`, `email`, `password`          |
| `loginError`                | Login failed                   | `message`                              |
| `requestLogout`             | Trigger logout flow            | -                                      |
| `loggedIn`                  | User logged in successfully    | -                                      |
| `loggedOut`                 | User logged out successfully   | -                                      |
| `requestPasswordReset`      | Request password reset email   | `email`                                |
| `passwordResetError`        | Password reset failed          | `message`                              |
| `openModal`                 | Open modal dialog              | `title`, `body`, `image`               |
| `notify`                    | Show notification              | `title`, `message`, `style`            |
| `tawktoLoaded`              | Tawkto script loaded           | -                                      |
| `startVideoRecording`       | Trigger video recording        | -                                      |
| `videoRecorded`             | Video recording completed      | `shareUrl`, `thumbnailUrl`, `embedUrl` |
| `videoRecorderStatusChange` | Video recorder status changed  | `newStatus`                            |

## 🗺️ Roadmap

- [ ] **eBay API Integration** - Display product listings
- [ ] **Services CTA Upgrade** - Enhanced call-to-action components
- [ ] **E-commerce Template** - Integration with Crystallize
- [ ] **Test Coverage** - Improve npm test coverage
- [ ] **Throttling wishlist DB operations** - Avoid DB calls spam
- [ ] **IGDB backend API** - Handle operations via API endpoints
- [ ] **AI chatbot** - For example for project estimates
- [ ] **Digimon API** - For fun

## ⚠️ Known Issues

### Keystatic Limitations

Current pain points with the [Keystatic](https://keystatic.com) integration that may require workarounds or future migration:

- **No media gallery** — uploaded assets cannot be browsed or reused across entries from a centralized library.
- **No custom file names** — uploaded media files keep their original names; there is no built-in way to enforce a custom naming convention (e.g. slug-based).
- **No per-collection preview images** — the collection list view does not support a thumbnail/preview image field for entries.
- **RichEditor stored as JSON** — the new `fields.mdx`/`fields.markdoc` rich editors persist content as JSON; the legacy `fields.document` field is deprecated and structured content cannot be authored as plain Markdown.

---

<div align="center">

Made by [xTalAlex](https://github.com/xTalAlex)

</div>

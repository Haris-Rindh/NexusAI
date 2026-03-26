# 🚀 LinkedIn Content & Carousel Builder

A powerful SaaS application designed to help users generate, schedule, and publish high-quality LinkedIn content and carousels using AI.

---

## 🛠 Features

### 🤖 AI-Powered Content Generation
- **Smart Carousel Builder:** Generate seamless, multi-slide carousels with AI-driven copy and design logic.
- **Post Generator:** Create engaging LinkedIn posts optimized for the current algorithm.

### 🔗 Smart LinkedIn Integration
- **Conditional Actions:** - **Connected Users:** Can directly **Publish** or **Schedule** posts to their LinkedIn profile.
  - **Unconnected Users:** Provided with **Copy Content** and **Download** options to manually share their creations.
- **Persistent Connection:** A dedicated "Connect LinkedIn" flow that remains accessible even if skipped during onboarding.

### 📅 Scheduling & Automation
- Directly queue posts for future dates with a built-in scheduling engine.
- Real-time status updates for published content.

---

## 💻 Tech Stack

<table style="width:100%">
  <tr>
    <th>Frontend</th>
    <th>Backend</th>
    <th>Database</th>
  </tr>
  <tr>
    <td>React.js</td>
    <td>Node.js</td>
    <td>MongoDB / PostgreSQL</td>
  </tr>
  <tr>
    <td>Tailwind CSS</td>
    <td>Express.js</td>
    <td>Mongoose / Sequelize</td>
  </tr>
</table>

---

## ⚙️ Logic & State Management

The application uses a strict **Connection State Logic** to handle user permissions:

| User Status | Available Actions | UI Elements |
| :--- | :--- | :--- |
| **LinkedIn Linked** | Publish, Schedule, Edit | Success Toasts, API Triggers |
| **Not Linked** | Copy to Clipboard, Download | "Connect Account" Prompt |

> **Note:** The "Published" success message is strictly gated behind a verified LinkedIn API response to prevent false positives.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/Haris-Rindh/NexusAI.git](https://github.com/Haris-Rindh/NexusAI.git)
cd NexusAI

# ⚡ AI Pipeline Studio — Interactive Node Canvas

> A sleek, enterprise-grade visual workflow automation builder built with **Next.js 16**, **React Flow**, **Zustand**, **Framer Motion**, and **Tailwind CSS**.

🌐 **Live Demo**: [https://workflow-canvas-tawny.vercel.app/](https://workflow-canvas-tawny.vercel.app/)

---

## ✨ Features

- 🎯 **Interactive Workflow Canvas**: Node-based canvas supporting dynamic cable connections, custom node types, drag-and-drop mechanics, and detach controls.
- 🤖 **Custom Pipeline Node Catalog**:
  - **⚡ Event Trigger**: Webhook / Cron event listeners with live cURL code generators.
  - **🤖 AI Agent Processor**: LLM agent node configurable for GPT-4o, Claude 3.5 Sonnet, and Llama 3 with temperature controls.
  - **🌐 HTTP Request**: Configurable REST API GET / POST / PUT / DELETE dispatcher.
  - **🎛️ JSON Data Mapper**: Interactive transform script mapper.
  - **Audit Inspector**: Formatted JSON audit payload inspector.
- 🎨 **Enterprise Dual Theme System**:
  - Dark mode (`#090A0E`) and high-contrast Stripe/Linear-style Light mode (`#F8FAFC`).
  - Powered by `useSyncExternalStore` and inline `<head>` scripts for zero-flicker FOUC prevention.
- 📂 **Multi-Flow Canvas Workspace**: Switch between multiple saved workflow canvases or create and delete custom flows on the fly.
- 📡 **Live Telemetry & Execution Modal**: Real-time step-by-step workflow execution simulation with event logs modal (`⌘K`).
- ⌨️ **Keyboard Shortcuts**:
  - `⌘R` / `Ctrl+R`: Execute pipeline workflow.
  - `⌘K` / `Ctrl+K`: Toggle live execution telemetry modal.
- 🛠️ **Clean & Type-Safe Codebase**: Built with zero magic strings, centralized node constants, and `cn()` utility class merging (`clsx` + `tailwind-merge`).

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **[Next.js 16](https://nextjs.org)** | React Framework (App Router & Turbopack) |
| **[@xyflow/react](https://reactflow.dev)** | Node-Based Interactive Canvas Engine |
| **[Zustand](https://zustand.docs.pmnd.rs)** | Global Workflow & Canvas State Management |
| **[Framer Motion](https://www.framer.com/motion/)** | Smooth Animations & Modal Transitions |
| **[Tailwind CSS](https://tailwindcss.com)** | Utility-First Modern CSS Styling |
| **[Lucide React](https://lucide.dev)** | Enterprise Icon Suite |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikaskumarsardar/workflow-canvas.git
   cd workflow-canvas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3005` (or `http://localhost:3000`) in your browser to view the interactive studio.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

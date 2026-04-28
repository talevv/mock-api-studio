# Mock API Studio

A GUI-based utility for creating, managing, and running mock APIs. Design realistic mock endpoints without writing code.

## Status

🚧 **In Progress** – Core functionality is under active development.

## Installation & Usage

> Available globally soon. Currently for development only.

The utility starts a local Node server with a web-based GUI where you can create and manage your mock API.

### Local Development

**Prerequisites:** Node.js v16+ and npm

**Setup:**

```bash
git clone <repository>
cd mock-api-studio
npm install
```

**Run Development Server:**

```bash
npm run dev
```

The development server starts on `http://localhost:3000` with hot-reload enabled via nodemon and ts-node.

**Build for Production:**

```bash
npm run build
npm start
```

## Features

- **Create & Store Endpoints** – Define mock endpoints with custom responses via the GUI
- **Activate/Deactivate** – Toggle which endpoints are active in your mock server
- **Mock Server** – Run a fully functional mock API server from your stored endpoints

## Coming Soon

- Collections/Projects – Organize endpoints into logical groups
- HTTP options - delays
- HTTP Interceptor – Capture and analyze requests to your mock API

---

*Start mocking APIs instantly without any setup.*

# Mock API Studio

A GUI-based utility for creating, managing, and running mock APIs. Design realistic mock endpoints without writing code.

## Status

🚧 **In Progress** – Core functionality is under active development.

## Installation & Usage
 
> **Note:** npm package coming soon. Currently available via local development only.
 
The app starts a local Node server with a web-based GUI where you can create and manage your mock API endpoints.
 
### Options
 
```
-p, --port <number>    Port to run the studio on (default: 3000)
```
 
### Local Development
 
**Prerequisites:** Node.js v20+ and npm
 
**Setup:**
 
```bash
git clone https://github.com/talevv/mock-api-studio
cd mock-api-studio
npm install
```
 
**Run development server:**
 
```bash
npm run dev
```
 
**Build:**
 
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

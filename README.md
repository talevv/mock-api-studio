# Mock API Studio

A GUI-based utility for creating, managing, and running mock APIs. Design realistic mock endpoints without writing code.

<img width="1920" height="996" alt="562_1x_shots_so" src="https://github.com/user-attachments/assets/38cb1e53-c042-4701-beae-f263e8dfe3ba" />


## Features

- **Create & Store Endpoints** – Define mock endpoints with custom responses via the GUI
- **Activate/Deactivate** – Toggle which endpoints are active in your mock server
- **Mock Server** – Run a fully functional mock API server from your stored endpoints

## Status

🚧 **In Progress** – Core functionality is under active development.

## Installation & Usage
 
> **Note:** npm package coming soon. Currently available via local development only.
 
The app starts a local Node server with a web-based GUI where you can create and manage your mock API endpoints.
 
### Options
 
```
Options:
  -p, --port <port>         Port to run the server on (default: "3000")
  -m, --mock-port <number>  port for the mock server (default: "4000")
  --no-open                 Do not automatically open the browser
  -h, --help                display help for command
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

### Testing as a global npm package

Build the project and link it globally:

```bash
npm run build
npm link
```

Now you can run `mock-api-studio` from any directory as if it were installed from npm.

To unlink when done:

```bash
npm unlink -g mock-api-studio
```

## Coming Soon

- Collections/Projects – Organize endpoints into logical groups
- HTTP options - delays
- HTTP Interceptor – Capture and analyze requests to your mock API

---

*Start mocking APIs instantly without any setup.*

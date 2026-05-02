#!/usr/bin/env node

import { program } from "commander";
import { startServer } from ".";
import { logger } from "./logger";

program
  .name("mock-api-studio")
  .description("A tool to create and manage mock APIs")
  .option("-p, --port <port>", "Port to run the server on", "3000")
  .option('-m, --mock-port <number>', 'port for the mock server', '4000')
  .option("--no-open", "Do not automatically open the browser")
  .parse();

const opts = program.opts();

logger.info(`Starting server with options: ${JSON.stringify(opts)}`);

startServer({
  port: opts.port,
  mockPort: opts.mockPort,
  open: opts.open
});
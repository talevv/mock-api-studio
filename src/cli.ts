#!/usr/bin/env node

import { program } from "commander";
import { startServer } from ".";
import { logger } from "./logger";

program
  .name("mock-api-studio")
  .description("A tool to create and manage mock APIs")
  .option("-p, --port <port>", "Port to run the server on")
  .option("--no-open", "Do not automatically open the browser")
  .parse();

const opts = program.opts();

logger.info(`Starting server with options: ${JSON.stringify(opts)}`);

startServer({
  port: opts.port,
  open: opts.open
});

import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import { EndpointController } from './controllers/endpoint.controller';
import { ServerController } from './controllers/server.controller';
import { registerEndpoints } from './routing';
import { runMigrations } from './db/db-sqlite';
import { logger } from './logger';

runMigrations();

const app = express();
const port = 3000;
const endpointController = new EndpointController();
const serverController = new ServerController();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, './views/layouts'),
  partialsDir: path.join(__dirname, './views/partials'),
  helpers: {
    eq: (a: any, b: any) => a === b,
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
registerEndpoints([endpointController, serverController], app);

app.get('/', (req, res) => {
  res.redirect('/endpoints');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

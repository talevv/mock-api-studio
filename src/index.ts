
import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import { EndpointController } from './controllers/endpoint.controller';
import { registerEndpoints } from './routing';
import { runMigrations } from './db/db-sqlite';

runMigrations();

const app = express();
const port = 3000;
const endpointController = new EndpointController();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, './views/layouts'),
  helpers: {
    eq: (a: any, b: any) => a === b,
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
registerEndpoints([endpointController], app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

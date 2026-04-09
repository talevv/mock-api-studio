
import express from 'express';
import { EndpointController } from './controllers/endpoint.controller';
import { registerEndpoints } from './routing';

const app = express();
const port = 3000;
const endpointController = new EndpointController();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
registerEndpoints([endpointController], app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

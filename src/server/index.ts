import express, { Request, Response, Router, Express } from 'express';
import router from './route';
import db from "./mongoDb";
import { RequestHandler } from 'express-serve-static-core';

const app: Express = express();

app.use(express.urlencoded({extended: true}) as RequestHandler);
app.use(express.json() as RequestHandler) 

const port: number = Number(process.env.PORT) || 3000;

db.connect();

app.use(express.static('dist'));
app.get('/', (req: Request, res: Response) => {
  console.log('sending index.html');
  res.sendFile('/dist/index.html');
});

const routes: Router[] = Object.values(router);
app.use('/api', routes);

app.listen(port);
console.log(`VaaS is awake on port: ${port}`);

import express from 'express';
import router from '../server/route';
import cookieParser from 'cookie-parser';
import db from '../server/mongoDb';
const routes = Object.values(router);

let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
db.connect();

export default app;

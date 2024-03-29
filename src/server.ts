import express,{ Application } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./configs/prisma.config";
import UserRouter from "./routes/user";
import NotiRouter from "./routes/noti";
import AuthRouter from "./routes/auth";
import DeviceRouter from "./routes/device";
import { credential } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { connectMqtt } from "./configs/mqtt.config";
import { backupScheduleJob } from "./services/schedule";
import LogRouter from "./routes/log";
import HospitalRouter from "./routes/hospital";
import GroupRouter from "./routes/group";
import { initRedis } from "./configs/redis.config";

const App: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10);

//middleware
App.use(express.json());
App.use(cors({ origin: '*' }));
App.use(morgan("dev"));
//firebase
initializeApp({
  credential: credential.cert(require('../temp-alarm-firebase-adminsdk-8vqko-fe5609cb68.json')),
  projectId: 'temp-alarm',
});
//mqtt
connectMqtt();
//backup
backupScheduleJob();

//route
App.use('/api/user', UserRouter);
App.use('/api/noti', NotiRouter);
App.use('/api/device', DeviceRouter);
App.use('/api/log', LogRouter);
App.use('/api/hospital', HospitalRouter);
App.use('/api/group', GroupRouter);
App.use('/api', AuthRouter);
App.use('/img', express.static('public/images'));
App.use('/font', express.static('public/fonts'));
App.listen(port, 'localhost', async () => {
  console.log(`Start server in port ${port}`);
  await initRedis();
});
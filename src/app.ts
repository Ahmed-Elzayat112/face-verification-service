import express, { Express } from "express";
import verificationRoutes from "./routes/verificationRoutes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", verificationRoutes);

export default app;

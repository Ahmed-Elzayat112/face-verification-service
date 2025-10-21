import "reflect-metadata";
import app from "./app";
import { initializeModel } from "./services/faceApiService";
import dotenv from "dotenv";
import { User } from "./models/user";
import { Sequelize } from "sequelize-typescript";

dotenv.config();

const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL || process.env.SQLITE_FILE;

const sequelize = connectionString
    ? new Sequelize(connectionString, {
          logging: false,
          dialect: "postgres",
          models: [User],
      })
    : new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false });

export default sequelize;

async function startServer() {
    try {
        console.log("Initializing AI model...");
        await initializeModel();
        console.log("Model initialized successfully.");

        console.log("Connecting to the database...");
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");

        await sequelize.sync();
        console.log("All models were synchronized successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}

startServer();

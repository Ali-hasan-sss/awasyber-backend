import app from "./app";
import env from "./config/env";
import { connectDatabase } from "./config/database";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
};

startServer();

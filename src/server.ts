/* eslint-disable no-console */
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

const port = config.port;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected !<>!");
    app.listen(port, () => {
      console.log(`Application listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database`, error);
  }
}
main();

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
const configPath = path.resolve("config", "uat.env");
dotenv.config({ path: configPath });

import server from "./app.js";
import { connectDB } from "./config/db.js";

const serverStar = server.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${process.env.PORT}`);
  }
});

import app from "./src/app.js";
import dotenv from "dotenv";
import createDatabaseIfNotExists from "./src/lib/createDatabase.js";
import { createUserTable } from "./src/models/user.models.js";
import { createMessagesTable } from "./src/models/messages.model.js";
import { server } from "./src/lib/socket.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await createDatabaseIfNotExists();
    //creating the user table

    await createUserTable();

    // create messages table
    createMessagesTable();

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with failure
  }
}
startServer();

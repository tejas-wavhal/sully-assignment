const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect("mongodb://localhost:27017/sully-editor-task")
    .then((data) => {
      console.log(`🟢 Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.error(`🔴 Mongodb connection error: ${error.message}`);
      process.exit(1); // Exit the process with a failure code
    });
};

module.exports = {
  connectDatabase: connectDatabase
};

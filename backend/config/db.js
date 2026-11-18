const mongoose = require("mongoose");
const dns = require("node:dns");

// Use public DNS resolvers for MongoDB Atlas SRV lookups.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

let pending;

// Safe to call per request: reuses the live connection, retries if the last attempt failed.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!pending) {
    mongoose.set("strictQuery", true);
    pending = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
      .finally(() => { pending = undefined; });
  }
  return pending;
};

module.exports = connectDB;

const mongoose = require("mongoose");

function dbConnect() {
  mongoose.connect(process.env.MONGODB_URL);
}

module.exports = dbConnect;

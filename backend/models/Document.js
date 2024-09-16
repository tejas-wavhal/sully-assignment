const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  _id: {
    type: String, // Use String for UUID
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

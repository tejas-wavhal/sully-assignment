const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const { v4: uuidv4 } = require("uuid");

router.post("/create", async (req, res) => {
  try {
    const newDocument = new Document({
      _id: uuidv4(),
    });
    await newDocument.save();
    res.json({ documentId: newDocument._id });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Error creating document" });
  }
});

router.get("/:id", async (req, res) => {
  const documentId = req.params.id;
  let document = await Document.findById(documentId);

  if (!document) {
    document = new Document({ _id: documentId });
    await document.save();
  }

  res.json(document);
});

router.post("/:id", async (req, res) => {
  const documentId = req.params.id;
  const { content } = req.body;
  try {
    await Document.findByIdAndUpdate(documentId, { content });
    res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document" });
  }
});

module.exports = router;

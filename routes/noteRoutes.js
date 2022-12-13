const express = require("express");
const router = express.Router();
const {getAllNotes, createNote, updateNote, deleteNote} = require("../controller/noteController")

router.route('/')
    .get(getAllNotes)
    .post(createNote)
    .patch(updateNote)
    .delete(deleteNote)

module.exports = router
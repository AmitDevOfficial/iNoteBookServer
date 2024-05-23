const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the notes with auth-token Id using GET "api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new note using POST "api/notes/addnote". Login Required--
router.post("/addnote", fetchuser, [
    body('title', 'Enter a Vaild title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 and more than characters').isLength({ min: 5 }),], async (req, res) => {

        try {
            const { title, description, tag } = req.body;
            //if there are errors, return bad request and the errors--
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();

            res.json(saveNote)
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })



// ROUTE 3: Update an existing note using PUT "api/notes/addnote". Login Required--
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create a newNote object--
        const newNote = {};

        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it--
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") };

        //Check the note are the real user  (Same user)--
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



// ROUTE 4: Delete Existing note using DELETE "api/notes/deletenotes". Login Required--
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {

    try {
        //Find the note to be Deleted and Delete it--
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") };

        //Check the note are the real user to delete (Same user)--
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note can be deleted Successfully", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

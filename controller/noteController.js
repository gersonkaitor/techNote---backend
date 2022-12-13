const User = require('../models/userModel')
const Note = require('../models/noteModel')
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @route GET /note
// @access Private
const getAllNotes = asyncHandler(async(req,res) =>{
    // Get All notes from MongoDB
    const notes = await Note.find().lean()
    
    // if no notes found
    if(!notes?.length){
     return res.status(400).json({message: "No notes found"})
    }

    // Add username to each note before sending the response
    const notesWithUser = await Promise.all(notes.map(async(note) =>{
        const user = await User.findById(note.user).lean().exec()
        return {...note, username:user.username}
    }))
    res.json(notesWithUser)
 })

// @desc Create new note
// @route POST /notes
// @access Private
const createNote = asyncHandler(async(req,res) =>{
    const {user , title, text} = req.body

    // Confirm data
    if(!user || !title || !text){
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate title
    const duplicateTitle = await Note.findOne({title}).lean().exec()

    if(duplicateTitle){
        return res.status(400).json({message: "Duplicate note ticket"})
    }

    const note = await Note.create({user, title, text})

    if(note){
        return res.status(201).json({message: "New note created"})
    }else{
        return res.status(400).json({message: 'Invalid note data received'})
    }
})

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async(req,res) =>{
    const {id,user, title, text, completed} = req.body

    // Confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message: 'All fields are required'})
    }

    // Confirm if note exists
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }

    // Check if duplicate title
    const duplicateTitle = await Note.findOne({title}).lean().exec()

    // Allow renaming of the original note
    if(duplicateTitle && duplicateTitle?._id.toString() !== id){
        return res.status(400).json({message: "Duplicate note title"})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed
    const updatedNote = await note.save()

   res.status(200).json(`${updatedNote} updated`)

})

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async(req,res) =>{
    const {id} =req.body

    if(!id){
        return res.status(400).json({message: "Note ID required"})
    }

    // Confirm note exists to delete
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }

    const result = await note.deleteOne();

    const reply =  `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})


 module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
 }
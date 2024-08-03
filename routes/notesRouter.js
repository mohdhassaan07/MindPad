const express = require("express");
const isloggedin = require("../middlewares/isloggedin");
const notemodel = require("../models/note");
const usermodel = require("../models/user");
const router = express.Router();

router.get("/", isloggedin, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email }).populate("notes");
    res.render("notes", { user })
})

router.post("/", isloggedin, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email });
    const { title, content, tags } = req.body;
    let alltags = tags.split(",")
    let creatednote = await notemodel.create({
        title,
        content,
        tags: alltags,
        createdBy: user._id
    })
    user.notes.push(creatednote._id);
    await user.save();
    res.redirect("/notes")
})

router.get("/tag", isloggedin, async (req, res) => {
    const tag = req.query.tag;
    const userId = req.user._id;
    try {
        const query = { createdBy: userId };
        if (tag) {
            query.tags = new RegExp(`^${tag}$`, 'i');
        }
        const notes = await notemodel.find(query);
        const tagExists = notes.length > 0;
        res.render("label", { notes,tagExists });
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/:noteid", isloggedin, async (req, res) => {
    const noteid = req.params.noteid;
    const note = await notemodel.findById(noteid);
    let time = String(note.createdAt);
    let newtime = time.slice(4, 21);
    res.render("notepage", { note, newtime });
})

router.post("/:noteid", isloggedin, async (req, res) => {
    const { title, content } = req.body;
    const noteid = req.params.noteid;
    const note = await notemodel.findByIdAndUpdate(noteid, { title: title, content: content, });
    res.redirect(`/notes/${noteid}`);
})

router.get("/delete/:noteid", isloggedin, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email });
    const noteid = req.params.noteid;
    const note = await notemodel.findByIdAndDelete(noteid);
    user.notes.pull(noteid);
    await user.save();
    res.redirect("/notes");
})
module.exports = router;
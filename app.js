require('dotenv').config();
const PORT = process.env.PORT || 4500
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/usersRouter.js")
const indexRouter = require("./routes/indexRouter.js")
const notesRouter = require("./routes/notesRouter.js")
app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'));
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));

app.use("/",indexRouter);
app.use("/users",usersRouter);
app.use("/notes",notesRouter);

app.listen(PORT, ()=>{console.log(`server started at port ${PORT}`);});

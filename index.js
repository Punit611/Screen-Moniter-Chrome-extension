const express=require("express");
const bodyparser=require("body-parser");
const mongodb=require("mongoose");
const path=require("path");
const session = require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const req = require("express/lib/request");
const { appendFile } = require("fs");
const cors = require('cors');

const port =process.env.PORT || 3000;
// Punnit611
const pass="Punit611";
const MONGODB_URI="mongodb+srv://punitsehrawat423:Punit611@cluster0.5jazrou.mongodb.net/test";

const app=express();

const store=new MongoDBStore({uri:MONGODB_URI,collection:"sessions"});
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");
app.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));

app.use(cors());

const authRoutes=require("./routers/auth");
const storeImageRoutes=require("./routers/storeImageData");
const homeRoutes=require("./routers/home");
const profileRoutes=require("./routers/profile");


app.get("/",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    console.log("in start");
    if(isLoggedIn)
    {
        res.redirect("/home");
    }
    else
        res.redirect("/signup");
    
});

app.use(authRoutes);
app.use(storeImageRoutes);
app.use(homeRoutes);
app.use(profileRoutes);

app.listen(port,()=>{
    console.log("connected at ",port);
});

mongodb.connect(MONGODB_URI,()=>{

    console.log("connected to mongoose",MONGODB_URI);
});


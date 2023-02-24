const express = require("express");
const ImageSchema = require("../model/imageSchema");
const user = require("../model/user");
const router = express.Router();

router.get("/home", async (req, res) => {
    const user=req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    
    console.log("in home get");
    const all_test = await ImageSchema.find({}, { test: 1, _id: 0 }).distinct("test");
    // res.send(users);
    res.render("all_test.ejs",{isLoggedIn,user,all_test});

});

function uniqByKeepLast( data) {

    let uni_data ={}
    let return_data =[]
    for(let i=0;i<data.length;i++)
    {
        uni_data[data[i]['email']]=data[i];
    }
    for (let key in uni_data) {
        return_data.push(uni_data[key]);
      }
    
    return return_data;
    

}


router.get('/testdetails', async function (req, res) {
    
    
    const user=req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    
    const test_link = req.query.test;
    console.log("in home post", req.query);

    console.log(test_link, req.body);
    let all_users = null
    if (test_link) {
        all_users = await ImageSchema.find({ test: test_link },{ test: 1, _id: 0,name:1,email:1});
        all_users =uniqByKeepLast(all_users);
        console.log("here in email", all_users);
        res.render("test_details.ejs",{isLoggedIn,user,all_users});
    } else
        res.send("hi");


});

router.get('/userdetails', async function (req, res) {
    
    const user=req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    
    console.log("in home post user_details", req.query);
    const test_link = req.query.test;
    const user_name = req.query.name;
    const email_name = req.query.email;
    console.log(test_link, user_name, email_name, req.body);
    let all_data = null
    if (user_name && email_name && test_link) {
        all_data = await ImageSchema.find({ test: test_link, name: user_name, email: email_name }).sort("time");
        console.log("here", all_data)
        res.render("user_details.ejs",{isLoggedIn,user,all_data});
    }
    else
        res.send("hi userdetils");
});




module.exports = router;
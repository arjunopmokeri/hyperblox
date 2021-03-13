var express = require('express')
var mongoose = require('mongoose')
var Product = require('./Models/Product')
var User = require('./Models/User')
var bodyparser = require('body-parser')
var db = require('./Mysetup/myurls').myurl;
//const Product = require('./Models/Product');
var app = express()
var port = process.env.PORT || 6000;

var urlencodedparser = bodyparser.urlencoded({ extended: false });
var jsonparser = bodyparser.json();

//app.use(bodyparser.json())

mongoose.connect(db).then(() => {
    console.log("Database is connected");
}).catch(err => {
    console.log("error is: " + err.message);
})


app.get('/', function (req, res) {
    res.status(200).send("welcome to the signup page");
})

app.post('/signup', jsonparser, function (req, res) {

    var newuser = new User(req.body);

    // console.log(req);
    // console.log(req.body);
    // if(lnewuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});
    User.findOne({ email: newuser.email }, function (err, user) {
        if (user) {
            return res.status(500).json({ auth: false, message: "email exist" });
        }
        console.log(newuser);
        newuser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "User not created" });
            }
            return res.status(200).json({ success: true, message: "User created", user: doc });

        });
    });

});

app.post('/product/create', jsonparser, function (req, res) {

    var newproduct = new Product(req.body);

    console.log(newproduct);

    newproduct.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Product not created" });
        }
        return res.status(200).json({ success: true, message: "Product created", product: doc });

    })

})

app.get('/product/list', function (req,res) {
    Product.find({}, function(err, cursor){
        if(err){
            return res.status(500).json({error:true, message:"Product not listed"})
        }
        else{
            return res.status(200).json({success:true, message:"Data is retrieved", data:cursor})
        }
    })
})

app.get('product/list/id', function (req,res) {
    //var id = req.params.id ;
    Product.findById(req.params.id, function(err, cursor) {
        if(err){
            return res.status(500).json({error:true, message:"Product not found"})
        }
        else{
            return res.status(200).json({success:true, message:"Data is retrieved", data:cursor})
        }
    })
})

app.post('/signin', jsonparser, function (req, res) {

    var userCred = {};
    userCred.email = req.body.email;
    userCred.password = req.body.password;

    User.findOne({ email: userCred.email }, function (err, profile) {

        if (!profile) {
            return res.status(500).send("User not exist");
        }
        else {
            console.log(profile);
            console.log(profile.email);
            console.log(profile.password);
            if (userCred.password == profile.password && userCred.email == profile.email) {
                return res.status(200).json({ success: true, message: "User authenticated" });
            }
            else if (userCred.password != profile.password) {
                return res.status(500).json({ success: false, message: "password is incorrect.Please try again" });
            }
            else if (userCred.email != profile.email) {
                return res.status(500).json({ success: false, message: "Email not exist.Create account" });
            }
            else {
                return res.status(500).json({ success: false, message: "Unautherized access" });
            }
        }
    })
})



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

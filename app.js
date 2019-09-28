
//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose= require("mongoose");

const accountSid = 'ACe3f773f1ac6cba64b48762182d1318a7';
const authToken = 'a75c24eb485d8ba1f05e039d58d8b9cc';
var client=require("twilio")(accountSid,authToken);
mongoose.set('useFindAndModify', false);

app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/alertDB",{useNewUrlParser : true});

var request = "";


const alertSchema = new mongoose.Schema({

  userName : String,
  userPhone : Number,
  userEmail : String,
  userHelpers : [Number]

});

const Alert = mongoose.model("Alert",alertSchema);

function handleResponse(json) {
   console.log("helloooo");
    console.log(json);
}


app.get("/", function(req,res){
  res.render("./signup");
});

app.post("/",function(req,res){
  const fullName = req.body.fullName;
  const phone= req.body.phone;
  request = phone;
  const email = req.body.email;

  const alert = new Alert ({
    userName : fullName,
    userPhone : phone,
    userEmail : email
  });

  alert.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("./numbers");
    }
  });
});

app.get("/numbers",function(req,res){
  res.render("./numbers");
});

app.post("/numbers",function(req,res){


  const phone1 = req.body.phone1;
  const phone2 = req.body.phone2;
  const phone3 = req.body.phone3;
  const phone4 = req.body.phone4;
  const phone5 = req.body.phone5;

  const helpers = [phone1,phone2,phone3,phone4,phone5];

  Alert.findOneAndUpdate({userPhone : request }, { userHelpers : helpers},function(err,foundUser){
    if(err) {
      console.log(err);
    } else {
      console.log("User Succesfully saved");
      res.redirect("./home");
    }
  });

});

app.get("/home",function(req,res){
  res.render("home");
});
app.post("/home",function(req,res){

   res.render("spee");


});

app.post("/command",function(req,res){

  if(req.body.myCommand==="emergency") {
  console.log("working");
    client.calls.create({
      url: 'https://demo.teilio.com/docs/voice.xml',
      to: '+919511533924',
      from: '+12672732347'
    }, function(err,call){
      if(err){
        console.log(err);
      }
      else{
        console.log(call.sid);
      }
    });

    client.messages.create({
      to: '+918447122306',
      from: '+12672732347',
      body: 'This is a message from Mridul using voice command'
    })
    .then((message) => console.log(message.sid));

    res.send("Making a call..");
  }
});



app.listen(3000,function() {
  console.log("Server started on port 3000");
});

//Google API - AIzaSyDrm3PaqXt3AS6X1FoLmdaRKEfWJSFWKAM

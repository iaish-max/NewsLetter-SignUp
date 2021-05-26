const express = require("express");//downloaded
const request = require("request");//downloaded
const bodyParser = require("body-parser");//downloaded
const https = require("https");
require('dotenv').config() //downloaded

const app = express();
app.use(express.static("public")); // to run style.css or image which are placed locally in computer.
app.use(bodyParser.urlencoded({extended: true})); //to use information get from html file(form).

app.get("/" , function(req,res){
  res.sendFile(__dirname + "/signup.html"); //make a file(signup.html) in users computer so then we open it locally.
});

app.post("/" , function(req,res){
  const name = req.body.firstName;
  const surname = req.body.lastName;
  const mail = req.body.email;

  const data =     // data which we have to sent to API(acc to API format).
  {
    members :[
      {
        email_address: mail,
        status : "subscribed",
        merge_fields: {
          FNAME: name,
          LNAME: surname
        }
      }
    ]
  };

  //when we have send data to API we send it in form of string not JSON.
  //when we get data from API it is in string form.

  const jsonData = JSON.stringify(data); //to make data in form of string.

  const url = process.env.API_URL;

  const options = {
    method : "POST",
    auth : process.env.API_KEY
  }

  const request = https.request(url, options, function(response){
    response.on("data",function(data){ // access the data coming from API.

      if(response.statusCode === 200 )
        res.sendFile(__dirname + "/success.html");
      else
        res.sendFile(__dirname + "/failure.html");
    })
  })

  request.write(jsonData); // sent data(jsonData) to API.
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/")  // redirect to root.
})

app.listen(process.env.PORT || 3000,function(){    //process.env.PORT for global server. 3000 for local server
  console.log("Server is running at 3000 port");
});

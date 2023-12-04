const mongoose =  require("mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/LoginDetails").then(()=> console.log("success")).catch((err) => console.log(err));
         
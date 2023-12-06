const express = require ("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");  //database db folder vitra ko sanga link
const Register = require("./models/registers");
const {json} = require("express");

const static_path = path.join(__dirname, "../public");  // for css
app.use(express.static(static_path));                   // css lai ho

const template_path = path.join(__dirname, "./templates/views");  //direct views xaina, template vitra views xa
const partials_path = path.join(__dirname, "./templates/partials");// eauta matra . because one step matra bahira gayeko xa


app.use(express.json());//json file ma handel garxa submit ma click handa
app.use(express.urlencoded({extended : false}));  //submit click garda data dekhauxa sapai 

app.set("view engine" ,  "hbs");
app.set("views",template_path); //template path vitra views xa
hbs.registerPartials(partials_path); // common navbar ko lagi partial banako xa so mathi hbs require garera path declare garera ya partial_path lai call gareko

app.get("/",(req,res) => {
    res.render("index");

});
 app.get("/register",(req,res) => {
    res.render("register");
 });

 app.get("/login",(req,res) => {
    res.render("login");
 });
 
// login checkk
app.post("/login", async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
       const useremail = await Register.findOne({email:email});  //database ma vayeko data read
    //    res.send(useremail); 
    //    console.log(useremail); 

    if(useremail.password === password) {
        // res.status(201).render("index");
        res.send("lo login vayo");
    } else {
        res.send("password or email wrong vayo");
    }

    } catch (error) {
        res.status(400).send("invalid email");
        
    }
})


//create a new user in database
app.post("/register", async (req,res) => {  //post method used, db ma store garna lai
    try {
         
        // console.log(req.body.username);   single lai
        // res.send(req.body.username);
        
        // const { username, email , password} = req.body;
        // console.log(username);
        // console.log(email);scsdc
        // console.log(password);

      // const datasave =  res.send(`username: ${username}, email: ${email}, password : ${password}`); // Send a single response containing both username and email
       
       const registerEmployee = new Register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    // Save the user to the database
    const registered = await registerEmployee.save();
     
     res.status(201).render("index");  //error aayo
    } catch (error) {
       // res.status(400).send(error);
       if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
        // If the error is due to duplicate email
        res.status(400).send("Email is already in use. Please use a different email.");
    } else {
        // Other errors
        res.status(400).send("Error registering user. Please try again.");
    }
    }

});

app.listen("80",() =>{
    console.log("listening")
})
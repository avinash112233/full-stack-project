const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverridde = require('method-override');
const path =require('path');
const app = express();
const port = process.env.PORT || 3000;



// Set templating engine in ejs
app.set('view engine','ejs');

// Middleware for Serving static files
app.use(express.static('public'));

//Bodyparser middleware
//This middleware is helps us to get the data
app.use(bodyParser.urlencoded({ extended: false }))
 //parse application/json
 app.use(bodyParser.json())

 //middleware for method override

 app.use(methodOverridde('_method'));
//Database url
const url = 'mongodb+srv://avinash:supriya@369@cluster0.amzr9.mongodb.net/Diary?retryWrites=true&w=majority';


// Connecting application with database
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log("mongodb is connnected"))
  .catch(err => console.log(err))

//Import Diary model
const Diary = require('./models/Diary');


//Routing
//Routing for /
app.get("/",(req,res) => {
    res.render("Home");
}) 

//Route for about page
app.get("/about",(req,res) => {
    res.render("About");
})
//Route for diary page
app.get("/diary",(req,res) => {
    Diary.find().then(data => {
        res.render("Diary",{data: data}); 
    })
    .catch(err => console.log(err))
    
})

//Route for adding Records
app.get('/add',(req,res) => {
    res.render('ADD');
})

//Route for Saving diary
//to get the content use body-parser
app.post('/add-to-diary',(req,res) => {
    //save data on to the database
    const Data= new Diary({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date
    })
    Data.save().then(() => {
        res.redirect('/diary')
    }).catch(err => console.log(err));
    
    
})

//Route for displaying records
app.get('/diary/:id',(req,res)=> {
    Diary.findOne({
        _id:req.params.id
    }).then(data =>{
        res.render('Page',{data:data});
    }).catch(err => console.log(err));
})

// Route for edit page
app.get('/diary/edit/:id',(req,res)=>{
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Edit',{data:data})
    }).catch(err => console.log(err));
})

app.put('/diary/edit/:id',(req,res) =>{
    Diary.findOne({
        _id:req.params.id
    }).then(data =>{
        data.title = req.body.title,
        data.description = req.body.description,
        data.sate = req.body.date


        data.save().then(()=>{
            res.redirect('/diary');
        }).catch(err => console.log(err));

    }).catch(err => console.log(err))
})

///Delete from database
app.delete('/data/delete/:id',(req,res) =>  {
    Diary.remove({
        _id:req.params.id
    }).then(()=>{
        res.redirect('/diary');
    }).catch(err => console.log(err))
})



//create a server
app.listen(port,() => {
    console.log("server is up and running");
});
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const _ = require('lodash')
app.set('view engine','ejs')
const mongoose = require('mongoose')
const { Template } = require('ejs')
mongoose.connect('mongodb+srv://maawan-admin:maawan123@mydbserver.ntmdmxm.mongodb.net/?retryWrites=true&w=majority' , {
    useUnifiedTopology: true
})

// 
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
let temp = "Sunday"
var today = new Date();
var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
};
var todo = []
var day = today.toLocaleDateString("en-US" , options)
temp = day
const entrySchema = new mongoose.Schema({
    name:String,
    done:Boolean
})
const Entry = new mongoose.model('Entry',entrySchema);
const listSchema = new mongoose.Schema({
    listName:String,
    lists:[entrySchema]
})
const List = new mongoose.model('List',listSchema);
app.get('/',(req,res)=>{
    Entry.find().then(function(document){
        todo = document
        res.render("list",{tasks:todo , date:temp})
    })
    
})
app.post('/insertTODO' , (req,res)=>{
    console.log(req.body)
    const listName = req.body.list_name;
    if(listName === temp){
        if(req.body.newItem != ""){
            const entry = new Entry({
                name:req.body.newItem,
                done:true
            })
            entry.save().then(function(err){
                res.redirect('/')
            });
        }
    }else{
        List.findOne({listName:listName}).then((data)=>{
            const entry = new Entry({
                name:req.body.newItem,
                done:true
            })
            data.lists.push(entry);
            data.save().then(function(err){
                res.redirect('/' + listName)
            });
            
        })
    }
    
    
})
app.post('/deleteItems',(req,res)=>{
    console.log(req.body);
    const t = req.body.checkBox.split("$");

    var id = t[0];
    const listName = t[1];
    if(listName === temp){
        console.log(id + " Got it");
        Entry.deleteOne({_id:id}).then(function(document){
            console.log(document)
            res.redirect('/')
        })
    }else{
        List.findOne({listName:listName}).then((data)=>{
            let tempList=[]
            data.lists.forEach(element => {
                if(element._id != id){
                    tempList.push(element);
                }
            });
            data.lists = tempList;
            data.save().then((err)=>{
                res.redirect('/'+listName);
            })
        })
    }
    
})
app.get('/:customListName',(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName + " ")
    List.findOne({listName:customListName}).then(function(document){
        console.log(document);
        if(document == null){
            console.log("Don't Exist")
            const list = new List({
                listName:customListName,
                lists:[]
            })
            list.save();
            res.render("list",{tasks:list.lists , date:customListName})
        }else{
            res.render("list",{tasks:document.lists , date:customListName})
            console.log("Exist");
        }
    })
})

app.listen(3002 || process.env.PORT , ()=>{
    console.log("Server at 3002")
})
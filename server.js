const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.set('view engine','ejs')

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

app.get('/',(req,res)=>{
    res.render("list",{tasks:todo , date:temp})
})
app.post('/insertTODO' , (req,res)=>{
    console.log(req.body)
    if(req.body.newItem != ""){
        todo.push(req.body.newItem)
    }
    res.render("list",{tasks : todo, date: temp})
})

app.listen(3002 || process.env.PORT , ()=>{
    console.log("Server at 3002")
})
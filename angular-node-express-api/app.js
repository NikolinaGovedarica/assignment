var express = require('express');
var app = express();

var fs = require('fs');
app.get('/getData', (req, res)=>{
    res.json({
        "statusCode":200,
        "statusMessage":"SUCCESS"
    })
});

app.get('/getCollection', (req, res)=>{
    res.send(loadJSON('../tree.json'));
});

app.get('/getItemById/:id', (req, res)=>{
    var id = req.params.id.toString();
    var idS = id.substr(1,id.length);
    console.log(idS);
    var data= loadJSON('../collection.json')['collection'];
    for (let collection of data) {
        if (collection.id === idS) {
            res.json(collection);
            return;
        }
    }
    res.status(404).send('Collection not found');
});

app.get('/getItemsByType/:type', (req, res)=>{
    var type = req.params.type.toString();
    var items = [];
    var typeTemp = type.substr(1,type.length);
    var data= loadJSON('../collection.json')['collection'];
    for (let collection of data) {
        if (collection.type === typeTemp) {
            items.push(collection);
        }
    }
    res.json(items);
    return;
    res.status(404).send('Collection not found');
});

app.listen(3000, (req, res)=>{
    console.log('Express API running on port 3000');
});

function loadJSON(filename){
    return JSON.parse(
        fs.existsSync(filename) ? 
        fs.readFileSync(filename).toString() :
        '""'
    )
}
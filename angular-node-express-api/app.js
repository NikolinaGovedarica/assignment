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
    res.json(loadJSON('../tree.json'))
});

app.get('/getCollectionById/:id', (req, res)=>{
    var id = req.params.id;
    var data= loadJSON('../collection.json')['collection'];
    for (let collection of data) {
        if (collection.id === id) {
            res.json(collection);
            return;
        }
    }
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
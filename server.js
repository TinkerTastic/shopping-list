var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.get = function(id){
    return this.items[id] || null;
};

Storage.prototype.update = function(update){
    var item = this.items[update.id];
    item.name = update.name;
    return item;
};

Storage.prototype.delete = function(item){
    if(!item){
        return;
    }
    this.items.splice(item.id,1);
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));


app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.put('/items/:id', jsonParser, function(req,res){
    var item = storage.get(req.params.id);
    if (!req.body) {
        return res.sendStatus(400);
    }
    else if(!item){
        item = storage.add(req.body.name);
        return res.status(200).json(item);
    }else{
        item.name = req.body.name;
        return res.status(200).json(storage.update(item));
    }
});


app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res){
    if (!req.params.id) {
        return res.sendStatus(400);
    }

    var item = storage.get(req.params.id);

    if(item){
        storage.delete(item);
        res.status(200).json(item);
    }
    else{
        res.status(404).json("invalid id");
    }

});

app.listen(process.env.PORT || 8081);

exports.app = app;
exports.storage = storage;
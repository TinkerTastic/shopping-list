var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


describe('Shopping List', function() {
    beforeEach(function(){
        storage.bootstrap();
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on PUT', function(done){
        chai.request(app)
            .put('/items/0')
            .send({name: 'Apple', id:'0'})
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Apple');
                res.body.id.should.be.a('number');
                res.body.id.should.equal(0);
                storage.items[0].should.be.a('object');
                storage.items[0].id.should.equal(0);
                storage.items[0].name.should.equal('Apple');
                done();
            });
    });

    it('should create new item if id unknown on PUT', function(done){
        chai.request(app)
            .put('/items/100')
            .send({name: 'Apple', id:'100'})
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.equal('Apple');
                res.body.id.should.be.a('number');
                storage.items[3].name.should.equal('Apple');
                storage.items[3].id.should.equal(res.body.id);
                done();
            });
    });

    it('should fail where no body is present on PUT', function(done){
        chai.request(app)
            .put('/items/100')
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });

    it('should delete an item on DELETE', function(done){
        chai.request(app)
            .delete('/items/0')
            .end(function(err, res){
                res.should.have.status(200);
                storage.items.length.should.equal(2);
                should.equal(storage.get(0), null);
                done();
            });
    });

    it('should fail with invalid id on DELETE', function(done){
        chai.request(app)
            .delete('/items/9000')
            .end(function(err, res){
                res.should.have.status(404);
                storage.items.length.should.equal(3);
                done();
            });
    })
});


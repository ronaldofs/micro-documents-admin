var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    servicebus = require('servicebus');

var Document = require('./document'),
    busUrl = process.env.RABBITMQ_PORT && process.env.RABBITMQ_PORT.replace('tcp', 'amqp'),
    bus = servicebus.bus({ url: busUrl }),
    server = express(),
    port = process.env.PORT || 3001,
    dbUrl = process.env.ADMINDB_PORT && process.env.ADMINDB_PORT.replace('tcp','mongodb') || 'mongodb://localhost/microservices-documents-admin';

mongoose.connect(dbUrl);

server.use(bodyParser.json());

server.post('/', function(req, res, next){
  Document.create(req.body, function(err, document) {
    if (err) return next(err);

    bus.publish('documentUpdated', document);
    res.status(200).json(document);
  });
});

server.put('/:id', function(req, res, next){
  Document.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, document) {
    if (err) return next(err);

    bus.publish('documentUpdated', document);
    res.status(200).json(document);
  });
});

server.use(function(err, req, res, next) {
  res.status(500).json(err);
});

server.listen(port);

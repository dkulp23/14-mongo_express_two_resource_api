'use strict';

const Router = require('express').Router;
const debug = require('debug')('card:card-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Card = require('../model/card.js');
const cardRouter = module.exports = new Router();

cardRouter.post('/api/card', jsonParser, function(req, res, next) {
  debug('POST /api/card');

  new Card(req.body).save()
  .then( card => res.json(card))
  .catch( err => {
    if ( err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

cardRouter.get('/api/card/:id', function(req, res, next) {
  debug('GET /api/card/:id');

  Card.findById(req.params.id)
  .populate('baseballArr')
  .then( card => {
    if (!card) return next(createError(404, 'Not Found'));
    res.json(card);
  })
  .catch( err => next(createError(404, err.message)));
});

cardRouter.put('/api/card/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/card/:id');

  Card.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( card => {
    let reqKeys = Object.keys(req.body);
    if (!card[reqKeys[0]]) {
      return next(createError(400, 'Bad Request'));
    }
    console.log('card:', card);
    res.json(card);
  })
  .catch( err => {
    console.error(err);
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

cardRouter.delete('/api/card/:id', function(req, res, next) {
  debug('DELETE /api/card/:id');

  Card.findByIdAndRemove(req.params.id)
  .then( card => res.json(card))
  .catch( err => next(createError(404, err.message)));
});

cardRouter.get('/api/card', function(req, res, next) {
  next(createError(400, 'No ID Provided'));
});

'use strict';

const express = require('express');

const knex = require('../knex');

const router = express.Router();


router.get('/', (req, res, next) => {
  console.log('in tags endpoint');
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex.select('id', 'name')
    .from('tags')
    .where({'id': id})
    .then(results => {
      if (results.length) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;

  /***** Never trust users - validate input *****/
  const updateObj = { 'name' : name ? name : null};

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .select('id', 'name')
    .from('tags')
    .where({id: id})
    .update(updateObj, ['id', 'name'])
    .then(results => {
      if (results.length) {
        res.json(results[0]);
      } else {
        next();
      }})
    .catch(err => {
      next(err);
    });
});


router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('tags')
    .where({id: id})
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});





module.exports = router;
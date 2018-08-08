'use strict';
// **********************************  BEFORE PUSHING UP CHANGE YOUR PASSWORD IN KNEXFILE ***********************************
const express = require('express');

const knex = require('../knex');

const router = express.Router();

// get all folders
router.get('/', (req, res, next) => {
  console.log('in folders endpoint');
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex.select('id', 'name')
    .from('folders')
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

// Update Folder The noteful app does not use this endpoint but we'll create it in order to round out our API
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .select('id', 'name')
    .from('folders')
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

// Create a Folder accepts an object with a name and inserts it in the DB. Returns the new item along the new id.
router.post('/', (req, res, next) => {
  const { name } = req.body;

  const newItem = { name };
  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert(newItem)
    .returning(['id', 'name'])
    .then(results => {
      if (results.length) {
        res.location(`http://${req.headers.host}/notes/${results[0].id}`).status(201).json(results[0]);
      }
    })
    .catch(err => {
      next(err);
    });

});

// Delete Folder By Id accepts an ID and deletes the folder from the DB and then returns a 204 status.
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('folders')
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
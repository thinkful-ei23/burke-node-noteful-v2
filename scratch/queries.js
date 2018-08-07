'use strict';

const knex = require('../knex');

let searchTerm = '';

knex
  .select('id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });

// Get Note By Id accepts an ID. It returns the note as an object not an array
// check whether the id is in notes on the other side

// const id = 1001;
// knex
//   .select('id', 'title', 'content')
//   .from('notes')
//   .where({'id': id})
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// Update Note By Id accepts an ID and an object with the desired updates. It returns the updated note as an object
// const objtoUpdate = {title: 'SCRATCH', content: 'BLAHBLHA'};
// const id = 1003;
// knex
//   .select('id', 'title', 'content')
//   .from('notes')
//   .where({id: id})
//   .update(objtoUpdate, ['id', 'title', 'content'])
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
  
//   .catch(err => {
//     console.error(err);
//   });


// Create a Note accepts an object with the note properties and inserts it in the DB. It returns the new note (including the new id) as an object.
// const noteToCreate = {title: 'SCRATCH2222 Five', content: 'YOOYOYOYOYO'};
// knex('notes')
//   .insert(noteToCreate)
//   .returning(['id', 'title', 'content'])
//   .then(console.log);

// Delete Note By Id accepts an ID and deletes the note from the DB.
// const id = 1001;
// knex('notes')
//   .where({id: id})
//   .del()
//   .then(console.log);
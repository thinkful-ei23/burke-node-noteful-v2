'use strict';

const hydrateNotes =  function(input) {
  // input = array of objects
  const hydrated = [], lookup = {};

  // syntax to loop over iterable objects
  for (let note of input) {

    // if there is no key in lookup called note.id (aka won't run this if it's a duplicated object)
    if (!lookup[note.id]) {

      // create that key (ex. 1003) and set it equal to the current object we're looping through { 1003 : obj}
      lookup[note.id] = note;

      // within that obj create a new key and set the value to an empty array { 1003 : { tags : [] } }
      lookup[note.id].tags = [];

      // push the object associated with that key onto the hydrated array (ex. push the current note with the key 1003)
      hydrated.push(lookup[note.id]);
    }
    //  if there is a tagId and tagName on an object
    if (note.tagId && note.tagName) {

      lookup[note.id].tags.push({
        // push an object onto the tags array (which is a new key) onto the new object with the tagId and tagName information
        id: note.tagId,
        name: note.tagName
      });
    }
    // get rid of the tagId and tagName keys and values on the original object
    delete lookup[note.id].tagId;
    delete lookup[note.id].tagName;

    // after we have changed lookup, the object in hydrated that matches the object in lookup is changed as well
  }
  return hydrated;
};

module.exports = hydrateNotes;
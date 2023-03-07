const { Entity, Schema } = require('redis-om');
const client = require('../database/config');

class User extends Entity {};

const userSchema = new Schema(User, {
  name: { 
    type: 'string' 
  },
  email: { 
    type: 'string' 
  },
  password: {
    type: 'string'
  },
  interest: {
    type: 'string[]'
  },
  active: {
    type: 'boolean'
  },
  createdAt: {
    type: 'date'
  },
  updatedAt: {
    type: 'date'
  }
}, {
  dataStructure: 'HASH'
});

const userRepository = client.fetchRepository(userSchema);

module.exports = userRepository;
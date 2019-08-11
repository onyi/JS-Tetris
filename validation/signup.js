const validator = require('validator');
const validateText = require('./valid-text');

module.exports = function validateSignup(data) {

  let errors = {};

  data.username = validateText(data.username) ? data.username : "";
  data.password = validateText(data.password) ? data.password : "";

  if(validator.isEmpty(data.username)) {
    error.username = "Username is required";
  }
  if(validator.isEmpty(data.password)) {
    error.password = "Password is required";
  }

  if(!validator.isEmail(data.email)) {
    error.email = "Email format is incorrect!"
  }else if(validator.isEmpty(data.email)){
    error.email = "Email cannot be empty!"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }



}
/* eslint-disable camelcase */
import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from '../helpers/validations';

import {
  errorMessage, successMessage, status,
} from '../helpers/status';

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const register = async (req, res) => {
  const {
    name, password, email, phone
  } = req.body;

  if (isEmpty(name) || isEmpty(password) || isEmpty(email) || isEmpty(phone)) {
    errorMessage.error = 'name, password, email and phone field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }
  // phone validation
  
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(name, password, email, phone, role, created_by, updated_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
  const values = [
    name,
    hashedPassword,
    email,
    phone,
    1,
    name,
    name
  ];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(dbResponse.name, dbResponse.role);
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    console.log(error)
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

/**isValidEmail(name) || 
   * Signin
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const login = async (req, res) => {
  const { name, password } = req.body;
  if (isEmpty(name) || isEmpty(password)) {
    errorMessage.error = 'Email or Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Please enter a valid Password';
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = 'SELECT * FROM users WHERE name = $1';
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [name]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = 'User with this name does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect';
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(dbResponse.name, dbResponse.role);
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  register,
  login,
};

import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
  hashPassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from '../helpers/validations.js';

import {
  errorMessage, successMessage, status,
} from '../helpers/status.js';

/**
   * Create A Admin
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createAdmin = async (req, res) => {
  const {
    name,
    password,
    created_by
  } = req.body;

  const { role } = req.user;

  const isAdmin = role == 0;

  if (isAdmin) {
    errorMessage.error = 'Sorry You are unauthorized to create an admin';
    return res.status(status.bad).send(errorMessage);
  }

  if (isEmpty(name) || isEmpty(password) || isEmpty(role)) {
    errorMessage.error = 'Name, password, role field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `
    INSERT INTO
    users(name, password, role, created_by)
    VALUES($1, $2, $3, $4)
    returning *
    `;
  const values = [
    name,
    hashedPassword,
    0,
    created_by,
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
      errorMessage.error = 'Admin with that NAME already exist';
      return res.status(status.conflict).send(errorMessage);
    }
  }
};

export {
  createAdmin,
};
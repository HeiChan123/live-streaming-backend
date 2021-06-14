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
const createAddress = async (req, res) => {
    const {
        room,
        floor,
        building,
        estate,
        street,
        district,
        sub_district,
        region
    } = req.body;

    const { name, role } = req.user;

    const isAdmin = role == 0;
    const created_on = moment(new Date());
    if (isAdmin) {
        errorMessage.error = 'Sorry You are unauthorized';
        return res.status(status.bad).send(errorMessage);
    }

    if (
        isEmpty(room) ||
        isEmpty(floor) ||
        isEmpty(building) ||
        isEmpty(estate) ||
        isEmpty(street) ||
        isEmpty(district) ||
        isEmpty(sub_district) ||
        isEmpty(region)
    ) {
        errorMessage.error = `
        room: ${isEmpty(room)}
        floor: ${isEmpty(floor)}
        building: ${isEmpty(building)}
        estate: ${isEmpty(estate)}
        street: ${isEmpty(street)}
        district: ${isEmpty(district)}
        sub_district: ${isEmpty(sub_district)}
        region: ${isEmpty(region)}
        `;
        return res.status(status.bad).send(errorMessage);
    }

    const createUserQuery = `
        INSERT INTO
        address(
            room,
            floor,
            building,
            estate,
            street,
            district,
            sub_district,
            region,
            created_on,
            created_by,
            updated_on,
            updated_by
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        returning *
        `;
    const values = [
        room,
        floor,
        building,
        estate,
        street,
        district,
        sub_district,
        region,
        created_on,
        name,
        created_on,
        name
    ];

    try {
        const { rows } = await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        const token = generateUserToken(dbResponse.name, dbResponse.role);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'fail';
            return res.status(status.conflict).send(errorMessage);
        }
    }
};


export {
    createAddress,
};
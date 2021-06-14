import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    errorMessage, status,
} from '../helpers/status';

import env from '../../../env';

dotenv.config();

/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.substring(7);
    console.log(token)
    if (!token) {
        errorMessage.error = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = {
            name: decoded.name,
            role: decoded.role,
        };
        next();
    } catch (error) {
        errorMessage.error = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
};

export default verifyToken;
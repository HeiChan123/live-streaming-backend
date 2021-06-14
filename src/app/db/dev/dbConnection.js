import pool from './pool.js';
import {sql} from '../../../../db';

pool.on('connect', () => {
  console.log('connected to the db');
});
/**
* Create All Tables
*/
const createAllTables = () => {
    const query = sql;
    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};
/**
* Drop All Tables
*/
const dropAllTables = () => {
    const query = `
    DROP TABLE IF EXISTS event_order;
    DROP TABLE IF EXISTS souvenir_order;
    DROP TABLE IF EXISTS payment_invoice;
    DROP TABLE IF EXISTS event_timeslot;
    DROP TABLE IF EXISTS souvenir;
    DROP TABLE IF EXISTS address;
    DROP TABLE IF EXISTS event;
    DROP TABLE IF EXISTS users;
    `;
    pool.query(query)
        .then((res) => {
            console.log(res);
            // pool.end();
        })
        .catch((err) => {
            console.log(err);
            // pool.end();
        });
};


dropAllTables();
createAllTables();
pool.end();
pool.on('remove', () => {
  console.log('pool removed');
  process.exit(0);
});

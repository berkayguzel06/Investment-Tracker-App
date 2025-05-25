import knex from 'knex';
const config = require('../../knexfile.js') as Record<string, knex.Knex.Config>;

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment as keyof typeof config]);

export default db; 
const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "menucard_v2",
  password: "YOUR_PASSWORD",
  port: 5432
});

module.exports = pool;
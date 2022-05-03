const dotenv = require("dotenv");
dotenv.config();
if (process.env.NODE_ENV == "production") {
  module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [process.cwd() + "/dist/database/entity/**/*.js"],
    migrations: [process.cwd() + "/dist/database/migration/**/*.js"],
    subscribers: [process.cwd() + "/dist/database/subscriber/**/*.js"],
    seeds: [process.cwd() + "/dist/database/entity/seeds/**/*.js"],
    factories: [process.cwd() + "/dist/database/entity/factories/**/*.js"],
    cli: {
      entitiesDir: process.cwd() + "/dist/database/entity/",
      migrationsDir: process.cwd() + "/dist/database/migration/",
      subscribersDir: process.cwd() + "/dist/database/subscriber/",
    },
  };
} else {
  module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: ["src/database/entity/**/*.ts"],
    migrations: ["src/database/migration/**/*.ts"],
    subscribers: ["src/database/subscriber/**/*.ts"],
    seeds: ["/dist/database/entity/seeds/**/*.ts"],
    factories: ["/dist/database/entity/factories/**/*.ts"],
    cli: {
      entitiesDir: "src/database/entity",
      migrationsDir: "src/database/migration",
      subscribersDir: "src/database/subscriber",
    },
  };
}
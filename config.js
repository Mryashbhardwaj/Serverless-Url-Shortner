module.exports = {
  development: {
    username: {$envkey$: "DB_USER", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "username"}},
    password: {$envkey$: "DB_PASS", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "password"}},
    database: {$envkey$: "DB_NAME", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "dbname"}},
    // host: {$envkey$: "DB_HOST", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "host"}},
    // port: {$envkey$: "DB_PORT", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "port"}},
    dialect: {$envkey$: "DB_ENGINE", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "engine"}},
    // protocol: {$envkey$: "DB_ENGINE", $smkey$: {secret: process.env.AWS_SM_SECRETS_DB, key: "engine"}}
  }
};
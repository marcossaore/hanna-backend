export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.ENVIRONMENT,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_DATABASE,
  },
});

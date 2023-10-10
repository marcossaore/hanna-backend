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
    queue: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASS,
    },
    aws: {
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
        version: process.env.AWS_VERSION,
        endpoint: process.env.AWS_ENDPOINT || null
    }
});
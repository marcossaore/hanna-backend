export default () => {
  const port = parseInt(process.env.PORT, 10) || 3000
  return {
    port,
    environment: process.env.ENVIRONMENT,
    app: {
      getUrl:
        port != 80 ? `${process.env.URL_APP}:${port}` : process.env.URL_APP
    },
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      db: process.env.DB_DATABASE,
      type: 'mysql' as const
    },
    queue: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      pass: process.env.REDIS_PASS,
      user: process.env.REDIS_USER
    },
    session: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      pass: process.env.REDIS_PASS,
      user: process.env.REDIS_USER,
      secret: process.env.SESSION_SECRET,
      maxAge: 1 * 12 * (60000 * 60),
      prefix: process.env.SESSION_PREFIX,
      secure: process.env.SESSION_SECURE === 'yes' ? true : false
    },
    aws: {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
      version: process.env.AWS_VERSION,
      endpoint: process.env.AWS_ENDPOINT || null,
      bucket: process.env.S3_BUCKET
    },
    smtp: {
      from: process.env.MAIL_FROM,
      user: process.env.MAIL_USER,
      host: process.env.MAIL_HOST,
      password: process.env.MAIL_PASSWORD,
      port: process.env.MAIL_PORT
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRESIN
    }
  }
}

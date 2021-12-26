module.exports = [
  {
    name: 'development',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: 'postgres',
    password: 'postgres',
    database: 'todo',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
  {
    name: 'production',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: true,
    extra: {
      rejectUnauthorized: false,
    },
  },
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
]

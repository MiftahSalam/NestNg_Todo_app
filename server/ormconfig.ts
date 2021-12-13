module.exports = [
  {
    // name: 'development',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: 'postgres',
    password: 'postgres',
    database: 'todo',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
]

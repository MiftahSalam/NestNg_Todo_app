import { getConnectionOptions, getConnection } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Logger } from '@nestjs/common'

export const getDbConnectionOptions = async (
  connectionName: string = 'default',
) => {
  const options = await getConnectionOptions(process.env.NODE_ENV || 'default')
  return {
    ...options,
    name: connectionName,
  }
}

export const getDbConnection = (connectionName: string = 'default') => {
  return getConnection(connectionName)
}

export const runDbMigrations = async (connectionName: string = 'default') => {
  const conn = getDbConnection(connectionName)
  await conn.runMigrations()
}

export const comparePassword = async (
  userPassword: string,
  currentPassword: string,
) => {
  // Logger.log(
  //   `compare password. currentPassword ${currentPassword} and userPassword ${userPassword}`,
  // )

  return await bcrypt.compare(userPassword, currentPassword)
}

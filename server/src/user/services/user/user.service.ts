import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { toUserDto } from '@shared/mapper'
import { comparePassword } from '@shared/utils'
import { catchError, from, map, Observable, switchMap } from 'rxjs'
import { CreateUserDto } from '../../dtos/create-user.dto'
import { LoginUserDto } from '../../dtos/login-user.dto'
import { UserDto } from '../../dtos/user.dto'
import { UserEntity } from '../../entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOneUser(options?: object): Observable<UserEntity> {
    Logger.log('findOneUser options', options, 'UserService')
    return from(this.userRepository.findOne(options)).pipe(
      catchError((err) => {
        throw new Error(err)
      }),
      //   map((user: UserEntity) => {
      //     if (!user) {
      //       throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      //     }
      //     const userDto: UserDto = toUserDto(user)

      //     return userDto
      //   }),
    )
  }

  findByLogin({ username, password }: LoginUserDto): Observable<UserDto> {
    return from(this.userRepository.findOne({ where: { username } })).pipe(
      catchError((err) => {
        throw new Error(err)
      }),
      switchMap((user: UserEntity) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        return from(comparePassword(password, user.password)).pipe(
          map((isEqual: boolean) => {
            if (!isEqual) {
              throw new HttpException(
                'Invalid credential',
                HttpStatus.UNAUTHORIZED,
              )
            } else return toUserDto(user)
          }),
        )
        // let same = false
        // comparePassword(password, user.password).then((isEqual: boolean) => {
        //   same = isEqual
        //   Logger.log(`login compare password isEqual ${isEqual}`)
        // })

        // if (!same) {
        //   throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED)
        // } else return toUserDto(user)
      }),
    )
  }

  findByPayload({ username }: any): Observable<UserDto> {
    Logger.log(`findByPayload username ${username}`, 'UserService')

    return from(this.userRepository.findOne({ where: { username } })).pipe(
      catchError((err) => {
        throw new Error(err)
      }),
      map((user: UserEntity) => {
        Logger.log(`findByPayload user ${user}`, 'UserService')
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        return toUserDto(user)
      }),
    )
  }

  create(userDto: CreateUserDto): Observable<UserDto> {
    const { username, password, email } = userDto

    return from(this.userRepository.findOne({ where: { username } })).pipe(
      switchMap((user: UserEntity) => {
        if (user) {
          throw new HttpException('User already exist', HttpStatus.BAD_REQUEST)
        }

        const new_user: UserEntity = this.userRepository.create({
          username,
          password,
          email,
        })
        return from(this.userRepository.save(new_user)).pipe(
          map((user_entity: UserEntity) => {
            return toUserDto(user_entity)
          }),
        )
      }),
    )
  }
}

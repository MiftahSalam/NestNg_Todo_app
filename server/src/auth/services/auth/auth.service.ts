import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { from, Observable, of, switchMap } from 'rxjs'
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface'
import { LoginStatus } from 'src/auth/interfaces/login-status.interface'
import { RegistrationStatus } from 'src/auth/interfaces/registration-status.interface'
import { CreateUserDto } from 'src/user/dtos/create-user.dto'
import { LoginUserDto } from 'src/user/dtos/login-user.dto'
import { UserDto } from 'src/user/dtos/user.dto'
import { UserService } from 'src/user/services/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  register(userDto: CreateUserDto): Observable<RegistrationStatus> {
    return from(this.userService.create(userDto)).pipe(
      switchMap((user: UserDto) => {
        let status: RegistrationStatus = {
          success: true,
          message: 'User Registered',
        }
        if (!user) {
          status = {
            success: false,
            message: 'User registration failed',
          }
        }

        return of(status)
      }),
    )
  }

  login(loginUserDto: LoginUserDto): Observable<LoginStatus> {
    return from(this.userService.findByLogin(loginUserDto)).pipe(
      switchMap((user: UserDto) => {
        let loginStatus: LoginStatus = {
          username: null,
          accessToken: null,
          expiredIn: null,
        }

        if (user) {
          const token = this._createToken(user)

          loginStatus = {
            username: user.username,
            ...token,
          }
        }

        return of(loginStatus)
      }),
    )
  }

  validateUser(payload: JwtPayload): Observable<UserDto> {
    if (!payload.username) {
      throw new HttpException(
        'Invalid token or not logged in',
        HttpStatus.UNAUTHORIZED,
      )
    }
    return from(this.userService.findByPayload(payload))
  }

  private _createToken({ username }: UserDto): any {
    const user: JwtPayload = { username }
    const accessToken = this.jwtService.sign(user)

    return {
      expiredIn: process.env.JWT_EXPIRED,
      accessToken,
    }
  }
}

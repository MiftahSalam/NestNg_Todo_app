import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { from, Observable } from 'rxjs'
import { UserDto } from '../../user/dtos/user.dto'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { AuthService } from '../services/auth/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    })
  }

  validate(payload: JwtPayload): Observable<UserDto> {
    return from(this.authService.validateUser(payload))
  }
}

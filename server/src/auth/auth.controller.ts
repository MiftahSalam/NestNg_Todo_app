import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { CreateUserDto } from 'src/user/dtos/create-user.dto'
import { LoginUserDto } from 'src/user/dtos/login-user.dto'
import { LoginStatus } from './interfaces/login-status.interface'
import { RegistrationStatus } from './interfaces/registration-status.interface'
import { AuthService } from './services/auth/auth.service'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(
    @Body() createUserDto: CreateUserDto,
  ): Observable<RegistrationStatus> {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  login(@Body() loginUserDto: LoginUserDto): Observable<LoginStatus> {
    return this.authService.login(loginUserDto)
  }
}

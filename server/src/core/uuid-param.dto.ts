import { IsUUID } from 'class-validator'

export class UUIDParamDto {
  @IsUUID()
  id: string
}

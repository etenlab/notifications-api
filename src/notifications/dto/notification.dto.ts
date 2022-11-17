import { IsDate, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PayloadDto } from './payload.dto';

class Notification {
  @IsNumber()
  id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  table_name: string;

  @IsNumber()
  row: number;

  @IsBoolean()
  acknowledged: boolean;

  @IsString()
  content: string;

  @IsDate()
  @Transform((params) => new Date(params.value))
  created_at: Date;
}

export type NotificationDto = PayloadDto<Notification>;

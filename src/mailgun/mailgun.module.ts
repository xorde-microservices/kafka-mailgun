import { Module } from '@nestjs/common';
import { MailgunController } from './mailgun.controller';
import { MailgunService } from './mailgun.service';

@Module({
  imports: [],
  controllers: [MailgunController],
  providers: [MailgunService],
})
export class MailgunModule {}

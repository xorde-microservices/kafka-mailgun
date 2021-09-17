import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // method receives incoming Kafka messages and processes it
  @MessagePattern(process.env.KAFKA_TOPIC || 'kafka-mailgun')
  public async sendMail(@Payload() payload: any): Promise<boolean> {
    return this.mailService.sendMail(payload.value);
  }
}

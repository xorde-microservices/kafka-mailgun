import { Controller } from '@nestjs/common';
import { MailgunService } from './mailgun.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailgunController {
  constructor(private readonly mailService: MailgunService) {}

  // method receives incoming Kafka messages and processes it
  @MessagePattern(process.env.KAFKA_TOPIC || 'kafka-mailgun')
  public async sendMail(@Payload() payload: any): Promise<boolean> {
    return this.mailService.sendMail(payload.value);
  }
}

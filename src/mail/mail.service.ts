/*
 SPDX-FileCopyrightText: 2021 Xorde Technologies <info@xorde.co>
 SPDX-License-Identifier: BSD-3-Clause
 */

import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { KafkaConfig } from '../config';
import * as Mailgun from 'mailgun.js';
import * as Mustache from 'mustache';
import * as fs from "fs";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly templateDir: string;

  @Client(KafkaConfig)
  client: ClientKafka;

  constructor() {
    this.templateDir = process.env.TEMPLATES_DIR || './templates';
    fs.readdir(this.templateDir, (err, files) => {
      this.logger.debug('Templates:' + JSON.stringify(files));
    });
  }

  // method sends mail
  public async sendMail(payload: any): Promise<boolean> {
    // instantiate a mailgun object
    const mg = Mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });

    const { uuid, from, to, subject }: any = payload;

    if (!uuid) {
      this.logger.error('Processing of message aborted due to empty uuid');
      this.logger.debug(JSON.stringify(payload));
      return true;
    }

    const data = {
      from,
      to: typeof(to) == 'string' ?  to.split(' ') : to,
      subject,
    };

    // add uuid to mailgun custom variables
    data['v:uuid'] = payload['uuid'];
    data['v:template'] = payload['template'];

    if (payload['template'] && payload['fields']) {
      this.logger.debug({ template: payload['template'], fields: payload['fields'] });
      const text = fs.readFileSync(`${this.templateDir}/${payload['template']}.txt`);
      const html = fs.readFileSync(`${this.templateDir}/${payload['template']}.html`);
      // we will remove javascript-style comments from text template:
      const jsComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;
      data['text'] = Mustache.render(text.toString().replace(jsComments,'').trim(), payload);
      data['html'] = Mustache.render(html.toString(), payload);
    } else {
      data['text'] = payload['body'];
      data['html'] = `<!DOCTYPE html><html lang="en"><body>${payload['body']}</body></html>`
    }

    this.logger.log(`Sending email message {"uuid":"${data['v:uuid']}", "to"="${data['to']}"}`);

    return mg.messages.create(process.env.MAILGUN_DOMAIN, data);
  }
}

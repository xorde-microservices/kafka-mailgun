## Installation

```bash
$ npm install
```

## Running locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker quickstart

This is minimal working docker configuration:

```bash
git clone https://github.com/xorde-microservices/kafka-mailgun
cd kafka-mailgun
docker build --tag kafka-mailgun .
docker run -d --name kafka-mailgun \
  -e KAFKA_BROKER=<kafka-host:9092> \
  -e MAILGUN_API_KEY='<Your Mailgun API key>' \
  -e MAILGUN_DOMAIN='<Your Mailgun domain name>'
  kafka-mailgun
```

This docker will connect to **kafka-host:9092** and subsribe to **kafka-mailgun** topic.

For sending emails out supplied Mailgun credentials will be used.

Only **basic** template will be available.

## Docker customization

### Environment variables

#### Mailgun
* `MAILGUN_API_KEY` Required
* `MAILGUN_DOMAIN` Required

#### Kafka
* `KAFKA_BROKER` Required
* `KAFKA_TOPIC` Optional, default: _kafka-mailgun_
* `KAFKA_CONSUMER_GROUP_ID` Optional, default: _default-consumer-group-id_
* `KAFKA_CLIENT_ID` Optional, default: _default-client-id_

#### Microservice
* `PORT` Optional, default: _3000_
* `TEMPLATES_DIR` Optional, default: _./templates_

## Sending messages

You need to send valid JSON formatted payload in order to send messages.
Messages are always sent in two forms: plaintext and html.

### Payload

This microservice supports templating mechanism provided by awesome [Mustache](https://www.npmjs.com/package/mustache) library.

#### Example

```json
{
  "uuid":"8d9266f8-f812-4ab9-8656-a3bf9ad1676b",
  "from":"no-reply@example.org",
  "to":["recipient@example.org"],
  "subject":"Sent using kafka-mailgun",
  "template":"basic",
  "fields":{"field1":"value1","field2":"value2"}
}
```

#### Schema

```typescript
{
  uuid: string;
  from: string;
  to: string | string[];
  subject: string;
  template: string;
  fields: object;
}
```

### Templates

By default only **basic** template is available that is stored in **./templates**. It is based on Mailgun recommended HTML _alert_ template.

You can change default template directory by adjusting `TEMPLATES_DIR` environment variable.

Templates directory must contain both htlm and txt versions of template. For this you need to create two files: _<template-name>_.txt and _<template-name>_.html

Text templates can also have _javascript-style_ comments.

#### Examples

Text-based template
```
/* This is comment */
This is basic text template.
Message sent from {{from}} using kafka-mailgun.
Custom fields are accessible like this: {{fields.field1}} 
```

HTML-based template
```html
<html lang="en">
<body>
<div style="color: #ff9f00">This is basic text template.</div>
<div>Message sent from {{from}} using kafka-mailgun.</div>
<div>Custom fields are accessible like this: 
    <b>{{fields.field1}}</b></div>
</body>
</html>
```
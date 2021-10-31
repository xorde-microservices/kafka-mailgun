# Kafka connector to Mailgun

[![CI Build](https://github.com/xorde-microservices/kafka-mailgun/actions/workflows/push_main.yml/badge.svg)](https://github.com/xorde-microservices/kafka-mailgun/actions/workflows/push_main.yml)

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

For sending emails out supplied Mailgun credentials will be used.

Only **basic** template will be available.

### 1. Download sources and Docker image build

```bash
git clone https://github.com/xorde-microservices/kafka-mailgun
cd kafka-mailgun
docker build --tag kafka-mailgun .
```

### 2a. Start with Kafka broker on-premise

This is minimal working docker configuration:

```bash
docker run -d --name kafka-mailgun \
  -e KAFKA_BROKER=<kafka-host:9092> \
  -e MAILGUN_API_KEY='<Your Mailgun API key>' \
  -e MAILGUN_DOMAIN='<Your Mailgun domain name>'
  kafka-mailgun
```

This docker image will connect to **kafka-host:9092** and subsribe to **kafka-mailgun** topic.

### 2b. Start with Kafka running in Confluent Cloud

```bash
docker run -d --name kafka-mailgun \
  -e KAFKA_BROKER=<confluent-host:9092> \
  -e MAILGUN_API_KEY='<Your Mailgun API key>' \
  -e MAILGUN_DOMAIN='<Your Mailgun domain name>' \
  -e CONFLUENT_API_KEY='<Your Confluent API key>' \
  -e CONFLUENT_API_SECRET='<Your Confluent API secret>' \
  kafka-mailgun
```

## Docker customization

### Environment variables

#### Mailgun
* `MAILGUN_API_KEY` **Required**

Example: `MAILGUN_API_KEY=123456789a123456789b123456789c12-12345678-12345678`

Private API key generated by [Mailgun dashboard - Settings - API Keys](https://app.mailgun.com/app/account/security/api_keys). 

* `MAILGUN_DOMAIN` **Required**

Example: `MAILGUN_DOMAIN=your.domain.name`

You can find your domain name in [Mailgun dashboard - Sending - Domains](https://app.mailgun.com/app/sending/domains).

* `MAILGUN_VARIABLES` Optional, default: false.

Example: `MAILGUN_VARIABLES=uuid`

Specify what payload variables should be sent to Mailgun as custom variables. Please note, that custom variables are **also visible to recipient** in _X-Mailgun-Variables_ header of email message envelope.

#### Kafka
* `KAFKA_BROKER` **Required**

Example: `KAFKA_BROKER=localhost:9092`

Hostname and port of Kafka broker. First broker (bootstrap) should be specified in case of Kafka configured as cluster.

* `KAFKA_TOPIC` Optional, default: _kafka-mailgun_

Kafka topic name that this microservice will subscribe to.

* `KAFKA_CONSUMER_GROUP_ID` Optional, default: _default-consumer-group-id_

Kafka consumer group ID.

> Consumers label themselves with a consumer group name, and each record published to a topic is delivered to one consumer instance within each subscribing consumer group. Consumer instances can be in separate processes or on separate machines.
If all the consumer instances have the same consumer group, then the records will effectively be load balanced over the consumer instances.
If all the consumer instances have different consumer groups, then each record will be broadcast to all the consumer processes.

Please refer to [Kafka intro](https://kafka.apache.org/intro) for more info.

* `KAFKA_CLIENT_ID` Optional, default: _default-client-id_

#### Microservice
* `PORT` Optional, default: _3000_
* `TEMPLATES_DIR` Optional, default: _./templates_

## Sending messages

You need to send valid JSON formatted payload in order to send messages.
Messages are always sent in two forms: plaintext and html.

### Special payload fields

`uuid` can be any string, but it is recommended to provide real UUID since it may be required in future updates.

`from` can be an address, or name and address like so `Test <test@example.org>`

`to` and `bcc` can be a string or array of strings; you can either provide space-separated string of addresses, or you can provide JSON array of strings.
Please note though, that if you specify multiple recipients in `to` message **will not be delivered individually**, meaning all recipients will be able to see other recipient addresses.

### Simple message

#### Example

```json
{
  "uuid":"8d9266f8-f812-4ab9-8656-a3bf9ad1676b",
  "from":"Sender <no-reply@example.org>",
  "to":["recipient@example.org"],
  "subject":"Sent using kafka-mailgun",
  "body":"Message text"
}
```

#### Schema

```
{
  uuid: string;
  from: string;
  to: string | string[];
  bcc: string;
  subject: string;
  body: string;
}
```

### Template support

This microservice supports templating mechanism provided by awesome [Mustache](https://www.npmjs.com/package/mustache) library.

#### Example

```json
{
  "uuid":"8d9266f8-f812-4ab9-8656-a3bf9ad1676b",
  "from":"Sender <no-reply@example.org>",
  "to":["recipient@example.org"],
  "subject":"Sent using kafka-mailgun",
  "template":"basic",
  "fields":{"field1":"value1","field2":"value2"}
}
```

#### Schema

```
{
  uuid: string;
  from: string;
  to: string | string[];
  bcc: string;
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

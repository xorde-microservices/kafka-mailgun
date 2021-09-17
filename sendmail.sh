#!/bin/bash
# SPDX-FileCopyrightText: 2021 Xorde Technologies <info@xorde.co>
# SPDX-License-Identifier: BSD-3-Clause

### show help if no arguments
if [ $# -eq 0 ]; then
  printf "Error: No arguments supplied\n\n" >&2
  cat << \
EOF
Usage:
  ./sendmail-template.sh -[srutfbo]=<value>

  Arguments:
  -s | --sender        : Sender email, can only be specified once;
                           Example: sender@example.org
  -r | --recipient     : Recipient email, can be specified multiple times;
                           Example: recipient@example.org
  -u | --subject       : Email subject;
                           Example: 'Test email'
  -t | --template      : Template name;
                           Example: basic
  -f | --fields        : Array of fields;
                           Example: '{"field1":"value1","field2":"value2"}'
  -k | --kafka         : Kafka broker host name using notation host:port;
                           Example: localhost:9092
  -o | --topic         : Kafka topic name;
                           Example: notify-email
Example:
  ./sendmail-template.sh \\
   -s=sender@domain.com \\
   -r=recipient@domain.com \\
   -u='kafka-mailgun test' \\
   -t=basic \\
   -f='{"name":"Test", "data":"Test data", "url":"https://example.org", "number":234}' \\
   -k=broker.kafka.com:9092 \\
   -o=kafka-email-topic
EOF
  exit 1
fi

### check if kafkacat is installed
if ! [ -x "$(command -v kafkacat)" ]; then
  echo 'Error: kafkacat is not installed.' >&2
  exit 2
fi

## parse command line arguments
for i in "$@"; do
    case ${i} in
        -s=*|--sender=*)
            FROM="${i#*=}"
            shift ## past argument=value
        ;;
        -r=*|--recipient=*)
            TO+="${i#*=}"
            shift ## past argument=value
        ;;
        -u=*|--subject=*)
            SUBJECT="${i#*=}"
            shift ## past argument=value
        ;;
        -t=*|--template=*)
            TEMPLATE="${i#*=}"
            shift ## past argument=value
        ;;
        -f=*|--fields=*)
            FIELDS="${i#*=}"
            shift ## past argument=value
        ;;
        -k=*|--kafka=*)
            BROKER="${i#*=}"
            shift ## past argument=value
        ;;
        -o=*|--topic=*)
            TOPIC="${i#*=}"
            shift ## past argument=value
        ;;
        *)
            echo "Error: Unknown parameter '${i#=*}'" >&2
            exit 3
        ;;
    esac
done

PAYLOAD="$(cat <<-EOF
{
  "uuid":"$(uuidgen)",
  "from":"$FROM",
  "to":"$TO",
  "subject":"$SUBJECT",
  "template":"$TEMPLATE",
  "fields":$FIELDS
}
EOF
)"

#echo "Payload: $PAYLOAD"
echo "Sending to Kafka topic '$TOPIC' on $BROKER..."
echo "$PAYLOAD" | tr -d '\n'
echo "$PAYLOAD" | tr -d '\n' | kafkacat -P -b "$BROKER" -t "$TOPIC" -Z
echo "Sent"
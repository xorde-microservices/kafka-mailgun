#!/bin/bash
# SPDX-FileCopyrightText: 2021 Xorde Technologies <info@xorde.co>
# SPDX-License-Identifier: BSD-3-Clause

THIS=kafka-mailgun
SELF=$0
UUID=$(uuidgen)

### show help if no arguments
if [ $# -eq 0 ]; then
  printf "Error: No arguments supplied\n\n" >&2
  cat << \
EOF
Usage:
  $SELF -[srutfbo]=<value>

  Arguments:
  -s | --sender        : Sender email, can only be specified once;
                           Example: -s=sender@example.org
  -r | --recipient     : Recipient email, can be specified multiple times;
                           Example: -r=recipient@example.org
                           Example: -r=addie.a@example.org -r=addie.b@example.org
  -b | --bcc           : Recipient email, can be specified multiple times;
                           Example: -b=bcc@example.org
                           Example: -b=bcc.a@example.org -b=bcc.b@example.org
  -u | --subject       : Email subject;
                           Example: -u='Test email'
  -t | --template      : Template name;
                           Example: -t=basic
  -f | --fields        : Array of fields;
                           Example: -f='{"field1":"value1","field2":"value2"}'
  -k | --kafka         : Kafka broker host name using notation host:port;
                           Example: -k=localhost:9092
  -o | --topic         : Kafka topic name;
                           Example: -o=notify-email
Example:
  $SELF \\
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
            if [ -z "$TO" ]; then
              TO='['
            else
              TO="${TO//\]/\,}" ## replace ] with ,
            fi
            TOA="${i#*=}"
            TO="$TO\"$TOA\"]"
            shift ## past argument=value
        ;;
        -c=*|--cc=*)
            if [ -z "$CC" ]; then
              CC='['
            else
              CC="${CC//\]/\,}" ## replace ] with ,
            fi
            CCA="${i#*=}"
            CC="$CC\"$CCA\"]"
            shift ## past argument=value
        ;;
        -b=*|--bcc=*)
            if [ -z "$BCC" ]; then
              BCC='['
            else
              BCC="${BCC//\]/\,}" ## replace ] with ,
            fi
            BCCA="${i#*=}"
            BCC="$BCC\"$BCCA\"]"
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

if [[ -z "$FROM" || -z "$TO" || -z "$TEMPLATE" || -z "$BROKER" ]]; then
  echo 'One or more variables are undefined'
  exit 4
fi

if [ -z "$SUBJECT" ]; then
  SUBJECT="Sent from kafka-mailgun"
fi

if [ -z "$TOPIC" ]; then
  TOPIC="$THIS"
fi

PAYLOAD="$(cat <<-EOF
{
  "uuid":"$UUID",
  "from":"$FROM",
  "to":$TO,
  "cc":${CC:=null},
  "bcc":${BCC:=null},
  "subject":"$SUBJECT",
  "template":"$TEMPLATE",
  "fields":$FIELDS
}
EOF
)"

echo "$PAYLOAD" | tr -d '\n'

printf "\nSending $UUID to Kafka topic '$TOPIC' on $BROKER..."
echo "$PAYLOAD" | tr -d '\n' | kafkacat -P -b "$BROKER" -t "$TOPIC" -Z
echo "Sent"
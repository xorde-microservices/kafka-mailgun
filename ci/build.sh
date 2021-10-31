#!/bin/sh

echo "Running as ${USER}"

### check if script is being run from project directory
if [ ! -f "docker-compose.yml" ]; then
  echo "Please run this script from your project directory."
  echo "Example: ci/build.sh"
  exit
fi

docker build . --tag=kafka-mailgun

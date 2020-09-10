#!/bin/sh

set -e

if [ -z "$INPUT_ACCOUNT_NAME" ]; then
  echo "no account name was given. Exiting"
  exit 1
fi

if [ -z "$INPUT_ACCOUNT_KEY" ]; then
  echo "no account key was given. Exiting"
  exit 1
fi

if [ -z "$INPUT_CONTAINER_NAME" ]; then
  echo "storage account container name was given. Exiting"
  exit 1
fi

SOURCE_DIR=${INPUT_SOURCE_DIR:-"."}

EXCLUDE_ARGS=" "

if [ "$INPUT_EXCLUDE_PATH" ]; then
  EXCLUDE_ARGS="--exclude-path "${INPUT_EXCLUDE_PATH}
fi

if [ "$INPUT_EXCLUDE_PATTERN" ]; then
  EXCLUDE_ARGS=$EXCLUDE_ARGS" --exclude-pattern "${INPUT_EXCLUDE_PATTERN}
fi

az storage blob sync -c ${INPUT_CONTAINER_NAME} -s ${SOURCE_DIR} --account-name ${INPUT_ACCOUNT_NAME} --account-key ${INPUT_ACCOUNT_KEY} ${EXCLUDE_ARGS} 
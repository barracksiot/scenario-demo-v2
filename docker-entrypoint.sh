#!/bin/bash
set -e

if [ "$1" = 'init-data' ]; then
  exec bash -c "/work/init-data $@"
elif [ "$1" = 'start-linux-device' ]; then
  cd devices
  exec /work/devices/start-linux-device $2
elif [ "$1" = 'start-windows-device' ]; then
  cd devices
  exec /work/devices/start-windows-device $2
elif [ "$1" = 'send-message' ]; then
  exec barracks message send --unitId "$2" --message "$3"
fi

exec "$@"

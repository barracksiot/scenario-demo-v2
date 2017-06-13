FROM        node:6

WORKDIR     /work

ENV         BARRACKS_ENABLE_V2=1
ENV         BARRACKS_BASE_URL="https://app.barracks.io"
ENV         BARRACKS_MQTT_ENDPOINT="mqtt://mqtt.barracks.io"
ENV         BARRACKS_ENABLE_EXPERIMENTAL=1

RUN         npm install -g barracks-cli
COPY        package.json    /work/package.json
RUN         npm install

COPY        devices     /work/devices
RUN         cd /work/devices && npm install

COPY        packages    /work/packages
COPY        init-data   /work/init-data
COPY        docker-entrypoint.sh  /entrypoint.sh

ENTRYPOINT  ["/entrypoint.sh"]

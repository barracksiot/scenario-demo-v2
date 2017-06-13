FROM node:6

MAINTAINER      Remi Riviere <remi@barracks.io>

WORKDIR			/work

ENV				BARRACKS_ENABLE_V2					1
ENV 			BARRACKS_ENABLE_EXPERIMENTAL 		1

COPY            devices								./devices/
COPY            packages							./packages/
COPY            node_modules						./node_modules/
COPY			init-data							init-data
COPY			package.json						package.json

RUN 			apt-get update && apt-get install vim
RUN 			npm install

ENTRYPOINT		["bash"]
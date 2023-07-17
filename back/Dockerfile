FROM alpine:latest

COPY src /portage/back/src
COPY package.json /portage/back/package.json
COPY tsconfig.json /portage/back/tsconfig.json
COPY tsconfig.build.json /portage/back/tsconfig.build.json
COPY entrypoint.sh /entrypoint.sh

RUN apk add --update bash npm && npm install -g n && n install latest && cd /portage/back && npm install && npm run build && chmod +x /entrypoint.sh

CMD ["/entrypoint.sh" ]

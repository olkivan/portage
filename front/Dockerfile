FROM nginx:1.24.0-alpine as builder
COPY src /portage/front/src
COPY public /portage/front/public
COPY .env /portage/front/.env
COPY package.json /portage/front/package.json
COPY tsconfig.json /portage/front/tsconfig.json
RUN apk add --update bash nodejs npm && npm install -g n && n install latest && cd portage/front && npm install && npm run build


FROM nginx:1.17.8-alpine

# COPY srvapi /srvapi
# RUN apk add --update nodejs npm && cd srvapi && npm install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY portage-front-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /portage/front/build /usr/share/nginx/html

CMD ["/entrypoint.sh" ]



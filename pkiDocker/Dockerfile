FROM node:6

ENV NODE_ENV development
COPY ./pki-svc /home/node/app
WORKDIR /home/node/app

# port 443 for node js
EXPOSE 443

CMD node ./bin/www
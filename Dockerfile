FROM node:19-alpine AS builder

WORKDIR /src/

COPY . ./

RUN npm install

RUN npm run build

FROM node:19-alpine

WORKDIR /srv/

COPY --from=builder /src/build ./build/

RUN npm install -g serve

EXPOSE 4480

CMD ["serve", "-s", "/srv/build", "-l", "4480"]
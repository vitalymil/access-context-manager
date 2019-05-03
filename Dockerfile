FROM node:10.15.3

WORKDIR /app/data
RUN wget https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz
RUN tar -xzf GeoLite2-City.tar.gz --wildcards --no-anchored --strip-components=1 '*GeoLite2-City.mmdb'
RUN rm GeoLite2-City.tar.gz

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]
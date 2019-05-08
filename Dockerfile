FROM node:7.7
RUN mkdir /tools
COPY package*.json ./
ENV ACCEPT_HIGHCHARTS_LICENSE YES
RUN npm install --only=production
COPY . .
EXPOSE 7801
CMD ["npm", "start"]

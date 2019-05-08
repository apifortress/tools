FROM node:7.7
FROM toolz
#RUN mkdir /tools
COPY package*.json ./
ENV ACCEPT_HIGHCHARTS_LICENSE YES
RUN npm install --only=production
COPY . .

EXPOSE 7801
# ENTRYPOINT ["node", "app.js"]
CMD ["npm", "start"]

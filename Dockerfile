FROM node:7.7
RUN mkdir /tools
COPY package*.json ./
RUN npm install --only=production
COPY . .
# RUN mkdir /tools/node_modules
# WORKDIR /tools
# COPY ./node_modules/ /tools/node_modules/

# COPY app.js /tools/

EXPOSE 7801
# ENTRYPOINT ["node", "app.js"]
CMD ["npm", "start"]

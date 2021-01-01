FROM node:15.5.0-alpine3.12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn global add serve
RUN npm -g install env-cmd
ENV NODE_OPTIONS=--max_old_space_size=3072
RUN env-cmd -f .env.production yarn build
CMD ["serve", "-s", "build"]


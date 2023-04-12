# These are Dockerfiles specifically 
# made aproduction version of our projects 

FROM node:14.14.0-alpine
WORKDIR "/app"
COPY package.json .
RUN npm install
COPY . .
# CMD ["npm","run","dev"] is used for the development environment.
# Usually when we move to a production environment,
# we change this to start because we might have a slightly different command.
CMD ["npm","run","start"]
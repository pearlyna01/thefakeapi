FROM node:lts-alpine3.19

WORKDIR /app

# update for security patches
RUN apk update && apk upgrade

# create user to run app
ENV USER=user
ENV GROUPNAME=group
ENV UID=4001
ENV GID=4000
RUN addgroup --gid "$GID" "$GROUPNAME" \
&&  adduser --disabled-password --gecos "" --ingroup "$GROUPNAME" --no-create-home --uid "$UID" $USER

# copying files
COPY . .
RUN npm install
RUN chown $USER:$GROUP -R *

USER user    
CMD ["node","index.js"] 
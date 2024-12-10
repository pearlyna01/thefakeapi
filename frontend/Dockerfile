FROM python:alpine3.21

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
RUN python -m pip install -r requirements.txt
RUN chown $USER:$GROUP -R *

USER user    

ENV BACKEND_API=http://localhost:3000

CMD ["fastapi","run","main.py"] 
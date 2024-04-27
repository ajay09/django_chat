FROM --platform=arm64 python:3-alpine

ENV PYTHONUNBUFFERED 1

RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

WORKDIR /home/src

COPY ./requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

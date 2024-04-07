FROM --platform=arm64 python:3-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /home/src

COPY ./requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

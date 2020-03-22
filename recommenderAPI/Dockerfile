# Use an official Python runtime as an image
FROM python:3.7

WORKDIR /app

COPY . /app
RUN pip install -r requirements.txt

EXPOSE 5000

CMD python app.py


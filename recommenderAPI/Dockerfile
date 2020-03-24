FROM python:3.6
WORKDIR /usr/src/app

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt ./

RUN pip install -r requirements.txt
RUN python -m nltk.downloader stopwords

COPY . .

EXPOSE 5000

ENTRYPOINT [ "python" ]

CMD [ "app.py" ]

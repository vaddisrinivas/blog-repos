import logging
from time import time
from base64 import urlsafe_b64encode
from os import environ
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from datetime import datetime, timedelta

def generate_short_url():
    timestamp = int(time())
    unique_value = urlsafe_b64encode(str(timestamp).encode()).decode().rstrip("=")
    return unique_value

def get_mongo_client():
    mongo_uri = environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    return MongoClient(mongo_uri)
def set_url(mongo_client, short_url=None, original_url=None, ex=86400, password=None):
    try:
        if short_url is None:
            short_url = generate_short_url()
        urls_collection = mongo_client['urls']['urls_collection']
        expiry_time = datetime.utcnow() + timedelta(seconds=(ex if password == environ.get('URLS_PASS') else min(ex, 86400*3)))
        document = {
            "short_url": short_url,
            "original_url": original_url,
            "expiry": expiry_time,
        }
        urls_collection.insert_one(document)
        logging.info(f'Generated shortened URL: {short_url}')
        return short_url
    except PyMongoError as e:
        logging.exception(f'Error setting url: {short_url}. Error: {e}')

def get_url(mongo_client, short_url):
    try:
        urls_collection = mongo_client['urls']['urls_collection']
        document = urls_collection.find_one({"short_url": short_url})
        if document is not None and document['expiry'] > datetime.utcnow():
            # Calculate remaining time until expiry in seconds
            remaining_time = (document['expiry'] - datetime.utcnow()).total_seconds()
            return document['original_url'], remaining_time
        else:
            return None, None  # Return None for both if the document doesn't exist or has expired
    except PyMongoError as e:
        logging.exception(f'Error getting url: {short_url}. Error: {e}')
        return None, None


def main(event, context):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.info(f'Event: {event}')
    mongo_client = get_mongo_client()
    if event["operation"] == "set":
        original_url, ex, password = event["original_url"], event["expiry"], event["password"]
        short_url = set_url(mongo_client=mongo_client, original_url=original_url, ex=ex, password=password)
        return [short_url]
    elif event["operation"] == "get":
        short_url = event["short_url"]
        original_url, expiry = get_url(mongo_client=mongo_client, short_url=short_url)
        return original_url, expiry

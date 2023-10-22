import logging
from time import time
from  redis import StrictRedis, RedisError
from base64 import urlsafe_b64encode
from os import environ

def generate_short_url():
    timestamp = int(time())
    unique_value = urlsafe_b64encode(str(timestamp).encode()).decode().rstrip("=")
    return unique_value


def set_url(redis_client, short_url=None, original_url=None, ex=86400):
    try:
        if short_url is None:
            short_url = generate_short_url()
        redis_client.set(short_url, original_url, ex=ex)
        logging.info(f'Generated shortened URL: {short_url}')
        return short_url
    except RedisError as e:
        logging.exception(f'Error setting url: {short_url}. Error: {e}')


def get_url(redis_client, short_url):
    try:
        original_url = redis_client.get(short_url)
        exp = redis_client.ttl(short_url)
        if original_url is not None:
            return original_url, exp
        else:
            return None
    except RedisError as e:
        logging.exception(f'Error getting url: {short_url}. Error: {e}')
        return None


def main(event, context):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    host = environ.get('REDIS_HOST', 'localhost')
    port = int(environ.get('REDIS_PORT', 6379))
    password = environ.get('REDIS_AUTH', 'redispass')
    db = environ.get('URLS_DB', 1)
    redis_client = StrictRedis(host=host, port=port, decode_responses=True, password=password, ssl=True,db=db)
    if event["operation"] == "set":
        original_url, ex = event["original_url"], event["ex"]
        short_url = set_url(redis_client=redis_client, original_url=original_url, ex=ex)
        return [short_url]
    elif event["operation"] == "get":
        short_url = event["short_url"]
        original_url, expiry = get_url(redis_client=redis_client, short_url=short_url)
        return original_url, expiry


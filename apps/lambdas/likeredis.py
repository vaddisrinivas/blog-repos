import logging
from redis import StrictRedis
from os import environ


def main(event, context):
    print("in main")
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    host = environ.get('REDIS_HOST', 'localhost')
    port = int(environ.get('REDIS_PORT', 6379))
    password = environ.get('REDIS_AUTH', 'redispass')
    db = environ.get('LIKES_DB', 1)
    redis_client = StrictRedis(host=host, port=port, decode_responses=True, password=password, ssl=True,db=db)
    if event["operation"] == "set":
        key = event["id"]
        new_count = redis_client.incr(key)
        print(key,new_count)
        return int(new_count)
    elif event["operation"] == "get":
        key = event["id"]
        count = redis_client.get(key)
        if count is None:
            count = 0
        print(key,count)
        return int(count)
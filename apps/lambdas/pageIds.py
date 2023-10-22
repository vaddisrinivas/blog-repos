import logging
from redis import StrictRedis
from os import environ


def main(event, context):
    print("in main")
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    host = environ.get('REDIS_HOST', 'localhost')
    port = int(environ.get('REDIS_PORT', 6379))
    password = environ.get('REDIS_AUTH', 'redispass')
    db = environ.get('PAGES_DB', 1)
    redis_client = StrictRedis(host=host, port=port, decode_responses=True, password=password, ssl=True,db=db)
    if event["operation"] == "set":
        key = event["id"]
        slug = event["slug"]
        redis_client.set(key,slug)
        return redis_client.get(key)
    
    elif event["operation"] == "get":
        res = {}
        for i in redis_client.keys():
            res.update({i:redis_client.get(i)})
        print(res)
        return res
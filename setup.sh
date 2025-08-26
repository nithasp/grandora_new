#!/bin/bash

# -------------------------------- Angular ----------------------------------
IMAGE_NAME="grandora/website"
TAG="1.0"
CONTAINER_NAME="grandora-website"
NETWORK="bridge-net"
PUB_PORT_01=80
PUB_PORT_02=443
DIR_LOG="/server/grandora_website/log"
DIR_CON_NGINX="/server/grandora_website/config/nginx.conf"
DIR_CON_DEFAULT="/server/grandora_website/config/default.conf"
DIR_CERT="/server/grandora_website/certificates/letsencrypt"

# ---------------------------------------------------------------------------
sudo docker stop $CONTAINER_NAME
sudo docker rm   $CONTAINER_NAME
sudo docker rmi  $IMAGE_NAME:$TAG

# ---------------------------------------------------------------------------
sudo docker build -t $IMAGE_NAME:$TAG /server/grandora_website
sudo docker run --name $CONTAINER_NAME \
                --network $NETWORK \
                -p $PUB_PORT_01:80 \
                -p $PUB_PORT_02:443 \
                --restart=always \
                -v $DIR_LOG:/var/log/nginx \
                -v $DIR_CERT:/letsencrypt \
                -v $DIR_CON_NGINX:/etc/nginx/nginx.conf \
                -v $DIR_CON_DEFAULT:/etc/nginx/conf.d/default.conf \
                -d $IMAGE_NAME:$TAG

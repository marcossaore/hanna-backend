#!/usr/bin/env bash
docker compose exec -it localstack aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket hanna
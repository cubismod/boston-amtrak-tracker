#!/usr/bin/env bash

if command -v docker &> /dev/null; then
    CONTAINER_ENGINE="docker"
elif command -v podman &> /dev/null; then
    CONTAINER_ENGINE="podman"
else
    echo "Error: neither docker nor podman is installed." >&2
    exit 1
fi

$CONTAINER_ENGINE build -t boston-amtrak-tracker .

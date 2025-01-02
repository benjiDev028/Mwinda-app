#!/bin/bash

set -e

host="$1"
port="$2"
user="$3"
db="$4"

echo "Waiting for PostgreSQL at $host:$port..."

while ! pg_isready -h "$host" -p "$port" -U "$user" -d "$db" > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

echo "PostgreSQL is ready. Starting the service..."
exec "$@"

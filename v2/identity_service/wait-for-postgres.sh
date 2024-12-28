#!/bin/bash

HOST=$1
PORT=$2
USER=$3
DATABASE=$4

# Attendre que PostgreSQL soit prêt
until pg_isready -h $HOST -p $PORT -U $USER -d $DATABASE; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready, starting the app..."
# Lancer l'application
exec "$@"

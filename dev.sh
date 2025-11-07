#!/bin/bash
# Convenience script to start development environment with hot reload

echo "Starting development environment with hot reload..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up


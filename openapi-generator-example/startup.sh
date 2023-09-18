#!/bin/bash

# Define some parameters for the script
BACKEND_IMAGE=${1:-backend} # The name of the backend image
FRONTEND_IMAGE=${2:-frontend} # The name of the frontend image
CURLER_SERVICE=${3:-curler} # The name of the curler service
GENERATOR_SERVICE=${4:-generator} # The name of the generator service
DEBUG=${5:-false} # The debug flag
LOG_FILE=${6:-docker.log} # The log file name

# Define a function for logging messages
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") [${1}] ${2}" | tee -a "${LOG_FILE}"
}

# Define a function for validating arguments
validate() {
  if [ -z "${1}" ]; then
    log "ERROR" "Missing argument: ${2}"
    exit 1
  fi
}

# Define a function for retrying commands with exponential backoff
retry() {
  local n=1
  local max=5
  local delay=5
  while true; do
    if [ "${DEBUG}" = true ]; then
      "$@" | tee -a "${LOG_FILE}" && break || {
        if [[ ${n} -lt ${max} ]]; then
          ((n++))
          delay=$((delay * 2))
          log "WARN" "Command failed. Attempt ${n}/${max}:"
          sleep ${delay};
        else
          log "ERROR" "The command has failed after ${n} attempts."
          exit 1
        fi
      }
    else
      "$@" >> "${LOG_FILE}" 2>&1 && break || {
        if [[ ${n} -lt ${max} ]]; then
          ((n++))
          delay=$((delay * 2))
          log "WARN" "Command failed. Attempt ${n}/${max}:"
          sleep ${delay};
        else
          log "ERROR" "The command has failed after ${n} attempts."
          exit 1
        fi
      }
    fi    
  done
}

# Validate the parameters
validate "${BACKEND_IMAGE}" "backend image name"
validate "${FRONTEND_IMAGE}" "frontend image name"
validate "${CURLER_SERVICE}" "curler service name"
validate "${GENERATOR_SERVICE}" "generator service name"
validate "${DEBUG}" "debug flag"
validate "${LOG_FILE}" "log file name"

# Build and run the backend image with docker-compose
log "INFO" "Building and running the backend image with docker-compose"
retry docker-compose build "${BACKEND_IMAGE}" && docker-compose up -d "${BACKEND_IMAGE}"

# Run the curler service with docker-compose
log "INFO" "Running the curler service with docker-compose"
retry docker-compose up "${CURLER_SERVICE}"

# Run the generator service with docker-compose
log "INFO" "Running the generator service with docker-compose"
retry docker-compose up "${GENERATOR_SERVICE}"

# Build and run the frontend image with docker-compose
log "INFO" "Building and running the frontend image with docker-compose"
retry docker-compose build "${FRONTEND_IMAGE}" && docker-compose up -d "${FRONTEND_IMAGE}"

log "INFO" "The script has completed successfully."

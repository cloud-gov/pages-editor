#!/bin/sh

# Wait for MinIO to start
sleep 10

# Set up MinIO Client
mc alias set localminio $MINIO_ENDPOINT_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Create multiple buckets

build_buckets() {
  local error_output
  local bucket_exists="Your previous request to create the named bucket succeeded and you already own it"

  # Turn into list of service names (buckets)
  IFS=',' read -r -a array <<< "$SITES_SERVICE_NAMES"

  for bucket in "${array[@]}"; do

    # Attempt to create the bucket and capture any error output
    error_output=$(mc mb localminio/$bucket 2>&1)

    # Check if there was an error
    if [ $? -ne 0 ]; then
      # Check the error was not an existing bucket
      if [[ $error_output != *"$bucket_exists"* ]]; then
        echo "Error creating $bucket: $error_output"
      fi

      mc anonymous set public localminio/$bucket

      echo "Bucket exists $bucket"
    else
      echo "Successfully created $bucket"
    fi
  done
}

# Run
build_buckets

#!/bin/bash

set -e -u

# Authenticate with CF
cf api $CF_API
cf auth

# Target the correct org and space
cf t -o $CF_ORG -s $CF_SPACE

# Validate that SERVICE_CREDENTIALS is valid JSON
if ! echo "$SERVICE_CREDENTIALS" | jq . > /dev/null 2>&1; then
    echo "Error: SERVICE_CREDENTIALS is not valid JSON"
    echo "SERVICE_CREDENTIALS value: $SERVICE_CREDENTIALS"
    exit 1
fi

# Function to extract credentials from current slot
get_current_credentials() {
    local current_slot=$(echo "$SERVICE_CREDENTIALS" | jq -r '.current.slot')
    local slot_key="slot$current_slot"

    local access_key_id=$(echo "$SERVICE_CREDENTIALS" | jq -r ".$slot_key.access_key")
    local secret_access_key=$(echo "$SERVICE_CREDENTIALS" | jq -r ".$slot_key.secret_key")

    # Create the credentials JSON for the user provided service
    echo "{ \"access_key_id\": \"$access_key_id\", \"secret_access_key\": \"$secret_access_key\" }"
}

# Get the current credentials
CURRENT_CREDENTIALS=$(get_current_credentials)

echo "Extracted credentials from slot $(echo "$SERVICE_CREDENTIALS" | jq -r '.current.slot')"

# Check if service already exists
if cf service $SERVICE_NAME > /dev/null 2>&1; then
    echo "Service $SERVICE_NAME already exists. Updating..."

    # Update the existing service with the extracted credentials
    cf update-user-provided-service $SERVICE_NAME -p "$CURRENT_CREDENTIALS"
else
    echo "Creating new service $SERVICE_NAME..."

    # Create the new service with the extracted credentials
    cf create-user-provided-service $SERVICE_NAME -p "$CURRENT_CREDENTIALS"
fi

echo "User provided service $SERVICE_NAME has been created/updated successfully."

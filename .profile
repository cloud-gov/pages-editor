export DATABASE_URI="$DATABASE_URL"?sslmode=require
export PAYLOAD_SECRET="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_SECRET")"
export OAUTH_CLIENT_ID="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_ID")"
export OAUTH_CLIENT_SECRET="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_SECRET")"
export PREVIEW_URL="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.PREVIEW_URL")"
export PROMPT_URL="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.PROMPT_URL")"

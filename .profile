export DATABASE_URI="$DATABASE_URL"?sslmode=require
export PAYLOAD_SECRET="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_SECRET")"
export OAUTH_CLIENT_ID="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_ID")"
export OAUTH_CLIENT_SECRET="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_SECRET")"
export EMAIL_HOST="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.EMAIL_HOST")"
export EMAIL_USERNAME="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.EMAIL_USERNAME")"
export EMAIL_PASSWORD="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-$APP_ENV-creds" ".[][] | select(.name == \$service_name) | .credentials.EMAIL_PASSWORD")"

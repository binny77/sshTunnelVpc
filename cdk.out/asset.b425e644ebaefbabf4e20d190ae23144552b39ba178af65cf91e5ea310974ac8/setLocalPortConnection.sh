#!/usr/bin/env bash

set -euo pipefail

function connectPort2222(){
aws ssm start-session \
  --target "$target" \
  --document-name "AWS-StartPortForwardingSession" \
  --parameters '{"portNumber": ["2222"], "localPortNumber": ["2222"]}'
}

connectPort2222
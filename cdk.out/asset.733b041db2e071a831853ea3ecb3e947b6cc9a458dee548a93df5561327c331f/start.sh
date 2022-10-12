#!/bin/bash

ssh-keygen -q -t rsa -N '' -f ~/.ssh/id_rsa <<<y >/dev/null 2>&1
cat ~/.ssh/id_rsa.pub > ~/.ssh/authorized_keys

aws ssm put-parameter --name ssh-tunnel-key --value "$(cat ~/.ssh/id_rsa)" --type "SecureString" --overwrite --key-id "${KEY_ID}"
#Use local key, put in above location
#Use mysql from container--done, image smaller then ubuntu if possible 

service ssh start

while (true); do
  sleep 10
done

#!/usr/bin/env bash

set -euo pipefail

clusterName=ssh-cluster
serviceName=ssh-tunnel

function select_task() {
  task=$(aws ecs list-tasks \
    --cluster "$clusterName" \
    --service-name "$serviceName" |
    jq -r '.taskArns[-1] | split("/") | .[-1]')
  echo "âž¡ï¸  selected task: ${task}"
}

function get_runtime_id() {
  runtimeId=$(aws ecs describe-tasks \
    --cluster "$clusterName" \
    --tasks "$task" |
    jq -r '.tasks[0].containers[] | select(.name == "'$serviceName'") | .runtimeId')
}

function build_ssm_target() {
  echo "âž¡ï¸  selected cluster: ${clusterName}"
  echo "âž¡ï¸  selected service: ${serviceName}"
  select_task
  get_runtime_id
  target="ecs:${clusterName}_${task}_${runtimeId}"
}

function connect() {
  build_ssm_target

  echo "ðŸŽ¯ Connecting to SSM target: $target"
  aws ssm start-session \
    --target "$target"
}

connect

echo "service closed"
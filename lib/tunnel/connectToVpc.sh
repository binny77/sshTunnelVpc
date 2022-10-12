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
  --target ecs:${clusterName}_${task}_${runtimeId}
}

connect
#!/bin/bash

ssh-keygen -q -t rsa -N '' -f ~/.ssh/id_rsa <<<y >/dev/null 2>&1
cat ~/.ssh/id_rsa.pub > ~/.ssh/authorized_keys

apt-get install netcat
apt-get install npm
apt-get install mysql-client

aws ssm put-parameter --name ssh-tunnel-key --value "$(cat ~/.ssh/id_rsa)" --type "SecureString" --overwrite --key-id "${KEY_ID}"
#Use mysql from container--done, image smaller then ubuntu if possible 

service ssh start

while (true); do
  sleep 10
done

echo "service closed"
FROM public.ecr.aws/ubuntu/ubuntu:latest

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt install -yq \
    curl \
    jq \
    openssh-server \
    unzip

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    rm -f awscliv2.zip && \
    ./aws/install

ADD start.sh /
RUN chmod +x /start.sh

RUN echo PasswordAuthentication no >> /etc/ssh/sshd_config
RUN echo Port 2222 >> /etc/ssh/sshd_config

CMD ["/start.sh"]
#Change port No. maybe, use PasswordAuthentication no as local key maybe?
FROM node:latest

RUN useradd --no-log-init --home-dir /app --uid 200 user < /dev/null
RUN useradd --no-log-init --home-dir /app --uid 502 go < /dev/null
RUN useradd --no-log-init --home-dir /app --uid 1002 ec2-user < /dev/null
RUN useradd --no-log-init --home-dir /app --uid 1001 go2 < /dev/null
RUN useradd --no-log-init --home-dir /app --uid 498 go3 < /dev/null
RUN useradd --no-log-init --home-dir /app --uid 500345588 me-user < /dev/null

RUN npm install -g bower
RUN npm install -g gulp

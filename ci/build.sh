#/bin/bash
set -e

NPM_VOLUME=anim-wordcloud.npm.${GO_PIPELINE_NAME}
NODEMOD_VOLUME=anim-wordcloud.nodemod.${GO_PIPELINE_NAME}

VOL_COMMANDS="-v $NPM_VOLUME:/app/.npm -v $NODEMOD_VOLUME:/app/node_modules"

DOCKER_VERSION=$(docker --version | sed 's/[^0-9]//g')
if [ x${DOCKER_VERSION} == x17178629171  ]; then
   echo "Old Docker detected"
   VOL_COMMANDS=''
   mkdir -p .npm
   mkdir -p node_modules
fi

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u 0:0 \
       $VOL_COMMANDS \
       -i -e HOME=/app vladistan/node \
       chown -R $UID /app/.npm

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u 0:0 \
       $VOL_COMMANDS \
       -i -e HOME=/app vladistan/node \
       chown -R $UID /app/node_modules

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u $UID:$UID \
       $VOL_COMMANDS \
       -i -e HOME=/app vladistan/node \
       npm install

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u $UID:$UID \
       $VOL_COMMANDS \
       -i -e HOME=/app vladistan/node \
       gulp test

sed  -i.bak  's@^SF:/app/@SF:@' report/coverage/report-lcov/lcov.info

/usr/local/sonar-runner/bin/sonar-runner

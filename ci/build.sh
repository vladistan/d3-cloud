#/bin/bash
set -e

export

echo Building build image
cd ci
./ciBuild.sh
cd ..


USE_UID=$UID

if [ ${USE_UID} -eq 500345588 ]; then
    USE_UID=1000
fi

echo Using UID ${USE_UID}

echo "Build D3-Cloud"

NPM_VOLUME=anim-wordcloud.npm.${GO_PIPELINE_NAME}
NODEMOD_VOLUME=anim-wordcloud.nodemod.${GO_PIPELINE_NAME}
CONFIG_VOLUME=anim-wordcloud.config.${GO_PIPELINE_NAME}
CACHE_VOLUME=anim-wordcloud.cache.${GO_PIPELINE_NAME}
BOWER_VOLUME=anim-wordcloud.bower.${GO_PIPELINE_NAME}

set -u


VOL_COMMANDS="-v $NPM_VOLUME:/app/.npm -v $NODEMOD_VOLUME:/app/node_modules"
VOL_COMMANDS="${VOL_COMMANDS} -v $CACHE_VOLUME:/app/.cache -v $CONFIG_VOLUME:/app/.config "
VOL_COMMANDS="${VOL_COMMANDS} -v $BOWER_VOLUME:/app/bower_components"

DOCKER_VERSION=$(docker --version | sed 's/[^0-9]//g')
if [ x${DOCKER_VERSION} == x17178629171  ]; then
   echo "Old Docker detected"
   VOL_COMMANDS=''
   BDIRS=".npm node_modules bower_components .cache .config"
   for x in ${BDIRS}
   do
       mkdir -p ${x}
   done
fi

echo "AS root setup volumes"
docker run -w /app  -v `pwd`:/app -u 0:0 \
    ${VOL_COMMANDS} \
    -i -e USE_UID=${USE_UID} -e HOME=/app local/nodebuild \
    /bin/bash ci/volPrep.sh


echo "AS root check volumes"
docker run -w /app  -v `pwd`:/app -u 0:0 \
    $VOL_COMMANDS \
    -ti -e USE_UID=$USE_UID -e HOME=/app local/nodebuild \
    /bin/bash


echo "Check NPM modules"
docker run -w /app -v `pwd`:/app -u $USE_UID:$USE_UID \
       $VOL_COMMANDS \
       -ti -e HOME=/app local/nodebuild \
        /bin/bash

echo "Install NPM modules"
docker run -w /app -v `pwd`:/app -u ${USE_UID}:${USE_UID} \
       ${VOL_COMMANDS} \
       -i -e HOME=/app local/nodebuild \
        npm install

echo "Check NPM modules"
docker run -w /app -v `pwd`:/app -u $USE_UID:$USE_UID \
       $VOL_COMMANDS \
       -ti -e HOME=/app local/nodebuild \
        /bin/bash


echo "JS Test"

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u ${USE_UID}:${USE_UID} \
       ${VOL_COMMANDS} \
       -i -e HOME=/app local/nodebuild \
       gulp test

echo "Publish S3"
docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u ${USE_UID}:${USE_UID} \
       ${VOL_COMMANDS} \
       -i -e HOME=/app \
       -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
       -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
       local/nodebuild \
       gulp publish-s3

sed  -i.bak  's@^SF:/app/@SF:@' report/coverage/report-lcov/lcov.info

/usr/local/sonar-runner/bin/sonar-runner

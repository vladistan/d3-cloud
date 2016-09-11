#/bin/bash
set -e

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


VOL_COMMANDS="-v $NPM_VOLUME:/app/.npm -v $NODEMOD_VOLUME:/app/node_modules"
VOL_COMMANDS="${VOL_COMMANDS} -v $CACHE_VOLUME:/app/.cache -v $CONFIG_VOLUME:/app/.config "
VOL_COMMANDS="${VOL_COMMANDS} -v $BOWER_VOLUME:/app/bower_components"

DOCKER_VERSION=$(docker --version | sed 's/[^0-9]//g')
if [ x${DOCKER_VERSION} == x17178629171  ]; then
   echo "Old Docker detected"
   VOL_COMMANDS=''
   mkdir -p .npm
   mkdir -p node_modules
fi

# echo "Reset /app owner"
#
# docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u 0:0 \
#        $VOL_COMMANDS \
#        -i -e HOME=/app local/nodebuild \
#        chown -R $UID /app/.npm
#
# echo "Reset node modules owner"
#
# docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u 0:0 \
#        $VOL_COMMANDS \
#        -i -e HOME=/app local/nodebuild \
#        chown -R $UID /app/node_modules
#
# echo "Install NPM modules"
#
echo "AS root setup volumes"
docker run -w /app  -v `pwd`:/app -u 0:0 \
    $VOL_COMMANDS \
    -i -e USE_UID=$USE_UID -e HOME=/app local/nodebuild \
    /bin/bash ci/volPrep.sh

echo "Install NPM modules"
docker run -w /app -v `pwd`:/app -u $USE_UID:$USE_UID \
       $VOL_COMMANDS \
       -i -e HOME=/app local/nodebuild \
        npm install

echo "JS Test"

docker run -w /app -v `pwd`/.m2:/.m2 -v `pwd`:/app -u $USE_UID:$USE_UID \
       $VOL_COMMANDS \
       -i -e HOME=/app local/nodebuild \
       gulp test

sed  -i.bak  's@^SF:/app/@SF:@' report/coverage/report-lcov/lcov.info

/usr/local/sonar-runner/bin/sonar-runner

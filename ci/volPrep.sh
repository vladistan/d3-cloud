#/bin/bash
set -e

echo "Preparing volumes"

echo "UID to USE ${USE_UID}"

ls -la 

BDIRS=".npm node_modules bower_components .cache .config"

for d in ${BDIRS}
do
   chown -R ${USE_UID} ${d}
done
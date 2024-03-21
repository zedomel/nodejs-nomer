#!/bin/sh

NOMER_VERSION=$1

echo "https://github.com/globalbioticinteractions/nomer/releases/download/${NOMER_VERSION}/nomer.jar)"
sh -c "(curl -L https://github.com/globalbioticinteractions/nomer/releases/download/${NOMER_VERSION}/nomer.jar) > ./bin/nomer && chmod +x ./bin/nomer" && \
	./bin/nomer clean && ./bin/nomer version

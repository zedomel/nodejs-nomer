#!/bin/sh

NOMER_VERSION=$1

echo "https://github.com/globalbioticinteractions/nomer/releases/download/${NOMER_VERSION}/nomer.jar)"
sudo sh -c "(curl -L https://github.com/globalbioticinteractions/nomer/releases/download/${NOMER_VERSION}/nomer.jar) > /usr/local/bin/nomer && chmod +x /usr/local/bin/nomer && nomer install-manpage" && \
nomer clean && nomer version
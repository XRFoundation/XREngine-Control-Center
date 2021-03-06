#!/bin/bash

#===========
# Parameters
#===========

while getopts f: flag; do
    case "${flag}" in
    f) XRENGINE_FOLDER=${OPTARG} ;;
    *)
        echo "Invalid arguments passed" >&2
        exit 1
        ;;
    esac
done

if [[ -z $XRENGINE_FOLDER ]]; then
    echo "Missing arguments"
    exit 1
fi

set -e

#=========================
# Verify Local File Server
#=========================

if lsof -Pi :8642 -sTCP:LISTEN -t >/dev/null; then
    echo "file server is configured"
    lsof -Pi :8642 -sTCP:LISTEN
else
    echo "file server is not configured"

    cd "$XRENGINE_FOLDER"/packages/server
    npm run serve-local-files
fi

exit 0

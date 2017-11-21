#!/bin/bash

rm /tmp/.X0-lock &>/dev/null || true
startx /usr/src/app/frontend/node_modules/electron/dist/electron /usr/src/app/frontend --enable-logging
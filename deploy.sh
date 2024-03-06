#!/bin/zsh

cd website
npm run build

cd ../infra
cdk deploy --profile personal
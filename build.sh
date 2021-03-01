#!/bin/bash

npm run build

tar zcvf dist.tar.gz dist/

scp dist.tar.gz $1:$2 

ssh $1 "tar zxvf $2/dist.tar.gz -C $2;rm -rf $2/dist.tar.gz"

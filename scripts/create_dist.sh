#!/usr/bin/env bash
if [ -z "$1" ]
  then
    echo "No version supplied"
    exit
fi

OUT=$2
if [ -z "$2" ]
  then
    OUT="."
fi


VER=$1
TEMP=$(mktemp -d /tmp/sdk.XXXXXXXX)
cp -a MobFox-iOS-SDK $TEMP/ 
mv $TEMP/MobFox-iOS-SDK $TEMP/MobFox-iOS-SDK-$VER 
DIR=$TEMP/MobFox-iOS-SDK-$VER
BUILD=~/Library/Developer/Xcode/DerivedData/MobFoxSDKSource-byqgsmmmekhhpwdcdmfcxdjtjydn/Build/Products/Release-iphoneos/MobFox.embeddedframework
cp -a $BUILD $DIR/
cp -a $BUILD $DIR/MobFoxDemo
pushd $TEMP
zip -r MobFox-iOS-SDK-$VER.zip MobFox-iOS-SDK-$VER
popd
mv $TEMP/MobFox-iOS-SDK-$VER.zip $OUT

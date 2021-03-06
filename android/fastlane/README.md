fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android ibn
```
fastlane android ibn
```
Increment build number and push to repository - Build number in this case is the android version code
### android ivn
```
fastlane android ivn
```
Increment version number and push to repository - Version number in this case is the android version name
### android test
```
fastlane android test
```
Runs all the tests
### android internal
```
fastlane android internal
```
Submit a new Internal Beta Build
### android huawei
```
fastlane android huawei
```
Submit a new Release to Huawei App Gallery
### android deploy
```
fastlane android deploy
```
Deploy a new version to the Google Play

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

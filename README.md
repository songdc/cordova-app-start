# cordova-app-start
cordova 加载远程 WEB 服务为 APK 最佳启动模板

## 安装
clone
```
https://github.com/shitaozhang/cordova-app-start.git
```
install
```
cd cordova-app-start
npm install
```
run preview android
```
cordova emulate android
```
run preview ios
```
cordova emulate ios
```
build android
```
cordova build android
```
build ios
```
cordova build ios
```

> Android 打包输出目录
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 支持特性
- ✅ 加载远程 Web 服务功能开箱即用
- ✅ 避免打开系统浏览器
- ✅ 隐藏 Android 加载时放大缩小按钮
- ✅ 退出 webview 时直接退出 app 而非停留在 index.html 加载白屏
- ✅ 屏蔽安全策略（Android9+）也可访问
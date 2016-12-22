# node-mi-push

## 简介
小米推送服务端sdk

----------------------------------

## 依赖
- [`lodash`](https://github.com/lodash/lodash)
- [`form-data`](https://github.com/form-data/form-data)

## 安装
```
npm install node-mi-push
```


## 推送POST数据格式说明

- `payload`	消息的内容。
- `restrictedPackageName`	App的包名。备注：V2版本支持一个包名，V3版本支持多包名（中间用逗号分割）。
- `passThrough`	passThrough的值可以为：
    + 0 表示通知栏消息
    + 1 表示透传消息
- `title`	通知栏展示的通知的标题。
- `description`	通知栏展示的通知的描述。
- `notifyType`	notifyType的值可以是DEFAULT_ALL或者以下其他几种的OR组合：
    + DEFAULT_ALL = -1;
    + DEFAULT_SOUND  = 1;  // 使用默认提示音提示；
    + DEFAULT_VIBRATE = 2;  // 使用默认震动提示；
    + DEFAULT_LIGHTS = 4;   // 使用默认led灯光提示；
- `timeToLive`	可选项。如果用户离线，设置消息在服务器保存的时间，单位：ms。服务器默认最长保留两周。
- `timeToSend`	可选项。定时发送消息。用自1970年1月1日以来00:00:00.0 UTC时间表示（以毫秒为单位的时间）。注：仅支持七天内的定时消息。
- `notifyId`	可选项。默认情况下，通知栏只显示一条推送消息。如果通知栏要显示多条推送消息，需要针对不同的消息设置不同的notifyId（相同notifyId的通知栏消息会覆盖之前的）。
- `extra.soundUri`	可选项，自定义通知栏消息铃声。extra.soundUri的值设置为铃声的URI。
- `extra.ticker`	可选项，开启通知消息在状态栏滚动显示。
- `extra.notifyForeground`	可选项，开启/关闭app在前台时的通知弹出。当extra.notifyForeground值为”1″时，app会弹出通知栏消息；当extra.notifyForeground值为”0″时，app不会弹出通知栏消息。注：默认情况下会弹出通知栏消息。
- `extra.notifyEffect`	可选项，预定义通知栏消息的点击行为。通过设置extra.notifyEffect的值以得到不同的预定义点击行为。
    + 1：通知栏点击后打开app的Launcher Activity。
    + 2：通知栏点击后打开app的任一Activity（开发者还需要传入`extra.intentUri`）。
    + 3：通知栏点击后打开网页（开发者还需要传入`extra.webUri`）。
- `extra.intentUri`	可选项，打开当前app的任一组件。
- `extra.webUri`	可选项，打开某一个网页。
- `extra.flowControl`	可选项，控制是否需要进行平缓发送。默认不支持。value代表平滑推送的速度。注：服务端支持最低1000/s的qps，最高100000/s。也就是说，如果将平滑推送设置为500，那么真实的推送速度是3000/s，如果大于1000小于100000，则以设置的qps为准。
- `extra.layoutName`	可选项，自定义通知栏样式，设置为客户端要展示的layout文件名。
- `extra.layoutValue`	可选项，自定义通知栏样式，必须与layoutName一同使用，指定layout中各控件展示的内容。
- `extra.jobkey`	可选项，使用推送批次（JobKey）功能聚合消息。客户端会按照jobkey去重，即相同jobkey的消息只展示第一条，其他的消息会被忽略。合法的jobkey由数字（[0-9]），大小写字母（[a-zA-Z]），下划线（_）和中划线（-）组成，长度不大于8个字符。
- `extra.callback`	可选项，开启消息送达和点击回执。将extra.callback的值设置为第三方接收回执的http接口。
- `extra.​locale`	可选项，可以接收消息的设备的语言范围，用逗号分隔。
- `extra.​localeNotIn`	可选项，无法收到消息的设备的语言范围，逗号分隔。
- `extra.​model`	可选项，model支持三种用法。可以收到消息的设备的机型范围，逗号分隔。
- `extra.​modelNotIn`	可选项，无法收到消息的设备的机型范围，逗号分隔。
- `extra.​appVersion`	可以接收消息的app版本号，用逗号分割。安卓app版本号来源于manifest文件中的”android:versionName”的值。注：目前支持MiPush_SDK_Client_2_2_12_sdk.jar（及以后）的版本。
- `extra.​appVersionNotIn`	无法接收消息的app版本号，用逗号分割。
- `extra.​connpt`	可选项，指定在特定的网络环境下才能接收到消息。目前仅支持指定”wifi”。

详情参考[小米官网文档](http://dev.xiaomi.com/doc/?p=533)

## 使用

构建MiPush实例, 其中`defaults`为默认的post数据设置
```js
var miPush=new MiPush({
   appSecret:'YOUR-APP-SECRET',
// defaults:{
//   defaultPushOptions
// }
});
```

发送给一个或多个regId,其中`callback`函数接受参数为`callback(err,res)`,下同
```js
miPush.sendToRegIds('xxx',data,callback);
miPush.sendToRegIds(['xxx','xxxx1'],data,callback);
```

发送给一个或多个alias
```js
miPush.sendToAlias('xxx',data,callback);
miPush.sendToAlias(['xxx','xxxx1'],data,callback);
```

发送给所有订阅指定topic的用户
```js
miPush.sendToTopic('xxx',data,callback);
```

发送给所有订阅多个topics的用户,需要指定topic之间的操作关系支持以下三种：`UNION`并集,`INTERSECTION`交集,`EXCEPT`差集
```js
miPush.sendToTopics(['xxx','xxx1'],'UNION',data,callback);
```

## 功能缺失
- 推送多条消息
- ios推送功能
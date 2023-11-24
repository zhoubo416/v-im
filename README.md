
### 需要购买的阿里云的同学 请点击支持 [阿里云优惠券2000元](https://www.aliyun.com/activity/new/index?userCode=d4l0ykh3)
### 声明：切勿使用本软件从事任何违法事宜，使用本软件产生的任何后果皆由使用者承担，本软件及开发者概不承担任何责任。
### 加作者微信为了问问题，请先在下面加入知识星球，然后再问,谢谢。
### 加微:zkp_java 务必备注：v-im 并且附上点赞的 gitee 用户名，不点赞不让加哦
### 手机版源码微信联系。
### web版本测试地址：http://101.200.151.183, 主机填写：124.221.177.83,需要在网页版上面注册用户。
### 企业版exe下载：https://v-im-oss.oss-cn-beijing.aliyuncs.com/V-IM-1.1.44-setup.exe
### 企业版安卓APP![](https://gitee.com/lele-666/V-IM/raw/master/doc/ewm.png)

### Create by  [webstorm and intellij IDEA]
### 说明
>   系统是在RuoYi-vue(https://gitee.com/y_project/RuoYi-Vue) 的基础上开发的，但是把数据库操作改成mybatis-plus,原先的是mybatis（如果你想完全迁移到RuoYi系统里面，可能还需要一定的工作量）。

### 结构
>   1. v-im-pc 是聊天客户端，支持打包成exe 和 h5网页。
>   2. v-im-server 是服务端代码，集成了ruoyi的模块。
>   3. RuoYi-ui-vue3 是ruoyi管理系统的前端代码。
>   4. doc 下面有数据库等。
>   5. 1、2、3都是要启动的，务必先启动2
>   6. 开源版客户端连接 101.200.151.183 会报错，版本不一样，需要自己部署服务端，然后修改客户端的配置文件。
#### 使用部署文档在星球里，加星球后，在星球里可以向作者提问问题!
![加入星球](https://gitee.com/lele-666/V-IM/raw/master/doc/zsxq.png)

### 截图

![消息列表/聊天](https://gitee.com/lele-666/V-IM/raw/master/doc/img/1.png)
![好友](https://gitee.com/lele-666/V-IM/raw/master/doc/img/2.png)
![组织](https://gitee.com/lele-666/V-IM/raw/master/doc/img/3.png)
![群组](https://gitee.com/lele-666/V-IM/raw/master/doc/img/4.png)
![添加好友](https://gitee.com/lele-666/V-IM/raw/master/doc/img/5.png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(1).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(2).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(3).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(4).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(5).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(6).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(7).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(8).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(9).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(10).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(11).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/(12).png)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/s1.jpg)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/s2.jpg)
![手机](https://gitee.com/alyouge/V-IM/raw/master/doc/uniapp/s3.jpg)
 
 

### 功能点
1. 文本聊天
2. 聊天表情
3. 发送图片（http）
4. 发送文件（http）
5. 单聊
6. 群聊
7. 用户分组（后端支持）
8. 离线消息（单聊+群聊，支持消息提醒）
9. 聊天记录（单聊、群聊）
10. 支持心跳检测，断线重连
11. 使用ruoyi系统登录。
12. 好友添加
13. 群管理
14. 带有管理后台（原ruoyi-vue）
15. 树状组织机构
16. PC端消息转发
17. 手机语音消息
18. 手机通知（需要使用uni-cloud）
19. 截图（企业版）
20. 撤回（企业版）
21. 转发（企业版）
22. 好友审核:支持自定义设置加好友权限（企业版）
23. 复杂群管理：支持自定义设置加群权限，包括加群审核功能,支持@提醒（企业版）
24. 收藏（企业版）
25. electron-vite:新方式打包更快，开发也更快，支持多平台打包(企业版)
25. 支持多端登录，消息自动同步，支持同端踢人(企业版)
26. 代码结构全面优化，更容易二次开发(企业版)
27. 发送mp4视频(播放、全屏、下载)，输入框粘贴直接上传图片、视频、附件(企业版)
28. 前端代码重构优化，二次开发更友好(企业版)
29. 富文本输入框，支持表情，图片，@等(企业版)
30. 消息免打扰，消息置顶，新消息语音提醒。
31. mac linux 一键打包命令

### 参考项目及技术
> 1. RuoYi-vue（https://gitee.com/y_project/RuoYi-Vue）
> 2. layIM（主要是聊天表情，文件处理方面）。
> 3. 使用SpringBoot、oauth2.0、t-io 开发后端服务。
> 4. vue3.0、element-plus、typescript开发前端。
> 5. 界面高仿微信，如有侵权请告知。
> 6. 其他：使用 fetch 发送ajax 请求，支持跨域，electron 支持打包成为exe，也支持linux 和 mac 目前还没测试，有条件的同学可以测试。

### 交流授权
>  1. 如果您觉得好用，可以给点个star，或者给个捐赠。
>  2. 如需定制或者私有化部署，请加微:zkp_java。
>  3. 商用请捐赠并在捐赠【留言】里留下公司名称，没有留公司名商用视为侵权。
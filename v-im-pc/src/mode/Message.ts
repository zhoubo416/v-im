interface Message {
  //消息id,雪花id,有序增长
  id?: string;
  //消息文件类型 文本|附件|ping|语音
  messageType: string;
  //聊天室id
  chatId: string;
  //消息发送人
  fromId: string;

  //是否是本人
  mine: boolean;
  //消息内容
  content: string;
  //消息时间
  timestamp: number;
  //消息类型：私聊|群聊
  type: string;
  //扩展
  extend?: any;
}
export default Message;

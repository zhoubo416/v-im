import ChatUtils from "@/utils/ChatUtils";
import Message from "@/mode/Message";
import Receipt from "@/mode/Receipt";
import vimConfig from "@/config/VimConfig";
import Auth from "@/api/Auth";
import SendCode from "@/utils/SendCode";

const ready = '{"code":' + ChatUtils.MessageInfoType.MSG_READY + "}";
const ping = '{"code":' + ChatUtils.MessageInfoType.MSG_PING + "}";

class WsRequest {
  lockReconnect: boolean
  url: string | undefined
  //是否主动关闭
  closeByUser: boolean
  timeout: number
  timeoutError: number
  timeoutTask: NodeJS.Timeout | null
  reconnectTimeoutTask: NodeJS.Timeout | null
  socket: WebSocket | null

  private static instance: WsRequest

  private constructor() {
    this.lockReconnect = false //避免重复连接
    this.url = ''
    //是否主动关闭
    this.closeByUser = false
    //心跳检测
    this.timeout = 5000 //多少秒执行检测
    this.timeoutError = 8000 //超过多少秒没反应就重连
    this.timeoutTask = null
    this.reconnectTimeoutTask = null
    this.socket = null
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WsRequest()
    }
    return this.instance
  }

  public init(): void {
    this.url = `${vimConfig.wsProtocol}://${Auth.getIp()}:${
      vimConfig.wsPort
    }?token=${Auth.getToken()}&client=${vimConfig.client}`
    console.log('开始连接')
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => {
      console.log('连接成功')
      //告知服务器准备就绪
      this.send(ready)
      // 开启检测
      this.reset()
    }

    // 如果希望websocket连接一直保持，在close或者error上绑定重新连接方法。
    this.socket.onclose = () => {
      console.log('连接关闭')
      if (!this.closeByUser) {
        this.reconnect()
      }
    }

    this.socket.onerror = () => {
      console.log('连接error')
      this.reconnect()
    }

    this.socket.onmessage = (event: MessageEvent) => {
      const data = event.data
      const sendInfo = JSON.parse(data)
      // 真正的消息类型
      if (sendInfo.code === SendCode.MESSAGE) {
        this.onmessage(sendInfo.message)
      }
      //接受任何消息都说明当前连接是正常的
      this.reset()
    }
  }

  /**
   * 发送状态
   * @param value
   */
  send(value: string): void {
    if (this.socket?.readyState === 1) {
      this.socket.send(value)
    } else {
      this.reconnect()
    }
  }

  /**
   * 收到消息，这里会被重写覆盖
   * @param message 消息
   */
  onmessage = (message: Message): void => {
    console.log(message)
  }

  /**
   * 发送真正的聊天消息
   * @param message 消息
   */
  sendMessage(message: Message): void {
    const sendInfo = {
      code: SendCode.MESSAGE,
      message: message
    }
    this.send(JSON.stringify(sendInfo))
  }

  /**
   * 发送已读取消息
   * @param receipt 消息读取回执
   */
  sendRead(receipt: Receipt): void {
    const sendInfo = {
      code: SendCode.READ,
      message: receipt
    }
    this.send(JSON.stringify(sendInfo))
  }

  /**
   *  reset方法主要用来控制心跳的定时。
   *  先清除定时器，然后同时发送心跳和重连两个定时器
   *  因为心跳定时器短，在发送完成心跳后，服务器会返回一个消息，
   *  接受到消息后马上会reset,也就是服务器如果一直能够频繁（频率高于心跳时间）返回消息，心跳和重连根本不会执行
   */
  reset(): void {
    console.log('reset')
    // 清除定时器重新发送一个心跳信息
    if (this.timeoutTask) {
      clearTimeout(this.timeoutTask)
    }
    if (this.reconnectTimeoutTask) {
      clearTimeout(this.reconnectTimeoutTask)
    }
    //定时发送心跳
    this.timeoutTask = setTimeout(() => {
      this.send(ping)
    }, this.timeout)
    //onmessage拿到消息就会清理 reconnectTimeoutTask，如果没有清理，就会执行重连
    this.reconnectTimeoutTask = setTimeout(() => {
      this.reconnect()
    }, this.timeoutError)
  }

  // 重连
  reconnect(): void {
    console.log('重连')
    // 防止多个方法调用，多处重连
    if (this.lockReconnect) {
      return
    }
    this.lockReconnect = true

    //没连接上会一直重连，设置延迟避免请求过多
    this.reconnectTimeoutTask = setTimeout(() => {
      // 重新连接
      this.init()
      this.lockReconnect = false
    }, this.timeoutError)
  }

  // 手动关闭
  close(): void {
    //主动关闭
    if (this.timeoutTask) {
      clearTimeout(this.timeoutTask)
    }
    if (this.reconnectTimeoutTask) {
      clearTimeout(this.reconnectTimeoutTask)
    }
    this.closeByUser = true
    if (this.socket) {
      this.socket.close()
    }
  }
}

export default WsRequest


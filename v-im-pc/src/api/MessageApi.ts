import FetchRequest from "@/api/FetchRequest";

class MessageApi {
  static url = "/api/sys/messages";

  static list(chatId: string, fromId: string, type: string, pageSize: number) {
    const param =
      "?chatId=" +
      chatId +
      "&fromId=" +
      fromId +
      "&type=" +
      type +
      "&pageSize=" +
      pageSize;
    return FetchRequest.get(this.url + param, true);
  }

  static page(
    chatId: string,
    fromId: string,
    type: string,
    messageType: string,
    current: number,
    size: number
  ) {
    const param =
      "?chatId=" +
      chatId +
      "&fromId=" +
      fromId +
      "&chatType=" +
      type +
      "&messageType=" +
      messageType +
      "&current=" +
      current +
      "&size=" +
      size;
    return FetchRequest.get(this.url + "/page" + param, true);
  }
}

export default MessageApi;

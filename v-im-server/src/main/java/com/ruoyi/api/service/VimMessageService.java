package com.ruoyi.api.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruoyi.api.entity.Message;
import com.ruoyi.tio.TioWsMsgHandler;
import com.ruoyi.vim.utils.ChatUtils;
import org.tio.core.ChannelContext;
import org.tio.core.Tio;
import org.tio.core.TioConfig;
import org.tio.utils.lock.SetWithLock;
import org.tio.websocket.common.WsResponse;

import java.util.List;

/**
 * 消息处理接口
 *
 * @author 乐天
 */
public interface VimMessageService {

    /**
     * 添加消息到redis 队列
     *
     * @param message 消息
     * @param isRead  是否
     * @return boolean
     * @throws Exception 抛出异常
     */
    boolean save(Message message, boolean isRead) throws Exception;

    /**
     * 查询消息
     *
     * @param chatId   聊天室id
     * @param fromId   userId
     * @param type     聊天类型  私聊 群聊
     * @param pageSize 每页多少条
     * @return List
     */
    List<Message> list(String chatId, String fromId, String type, Long pageSize);


    /**
     * 分页查询
     *
     * @param chatId      聊天室id
     * @param fromId      发送人id
     * @param messageType 消息类型
     * @param chatType    聊天类型
     * @param searchText  搜索内容
     * @param page        分页条件
     * @return page
     */
    Page<Message> page(String chatId, String fromId, String messageType, String chatType, String searchText, Page<Message> page);

    /**
     * 读取未读消息，并清空(这里可能是会出现丢数据，未读消息清空后，消息没有发送成功，造成未读列表和已读列表都没有消息)
     * 未读消息只存私聊消息，群聊消息还在群列表里
     *
     * @param chatId 聊天室id
     * @return List
     */
    List<Message> unreadList(String chatId, String fromId);

    /**
     * 查询一个群的未读消息
     *
     * @param chatId 群id
     * @return List
     */
    List<Message> unreadGroupList(String userId, String chatId);

    /**
     * 已读消息的条数
     *
     * @param chatId 聊天室id
     * @param type   聊天室类型
     * @return 数量
     */
    Long count(String chatId, String userId, String type);

    /**
     * 读消息，并持久化到redis
     *
     * @param chatId    消息id
     * @param userId    消息读取人
     * @param type      类型
     * @param timestamp 系统时间
     */
    void read(String chatId, String userId, String type, long timestamp);


    /**
     * 推送消息
     *
     * @param message 消息
     * @throws Exception 抛出异常
     */
    void push(Message message) throws Exception;

    /**
     * 发送消息
     *
     * @param tioConfig  tioConfig
     * @param message    消息
     * @param wsResponse 响应
     * @param chatId     聊天室id
     * @throws Exception 抛出异常
     */
    default void sendMessage(TioConfig tioConfig, Message message, WsResponse wsResponse, String chatId) throws Exception {
        //单聊
        if (ChatUtils.MESSAGE_TYPE_FRIEND.equals(message.getType())) {
            SetWithLock<ChannelContext> channelContextSetWithLock = Tio.getByUserid(tioConfig, chatId);
            //用户没有登录，存储到离线文件
            if (channelContextSetWithLock == null || channelContextSetWithLock.size() == 0) {
                save(message, false);
            } else {
                //入库操作
                save(message, true);
                Tio.sendToUser(tioConfig, chatId, wsResponse);
            }
            Tio.sendToUser(tioConfig, message.getFromId(), wsResponse);
        } else {
            Tio.sendToGroup(tioConfig, chatId, wsResponse);
            //入库操作
            save(message, true);
        }
    }
}

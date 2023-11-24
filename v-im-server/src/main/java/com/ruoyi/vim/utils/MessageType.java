package com.ruoyi.vim.utils;

/**
 * 消息类型
 *
 * @author z
 */
public interface MessageType {

    /**
     * 文本消息
     */
    String TEXT = "0";
    /**
     * 图片消息
     */
    String IMAGE = "1";

    /**
     * 文件消息
     */
    String FILE = "2";
    /**
     * 语音消息
     */
    String VOICE = "3";
    /**
     * 撤回消息
     */
    String BACK = "4";
}

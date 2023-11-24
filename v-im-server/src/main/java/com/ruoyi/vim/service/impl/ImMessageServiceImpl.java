package com.ruoyi.vim.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ruoyi.vim.domain.ImMessage;
import com.ruoyi.vim.mapper.ImMessageMapper;
import com.ruoyi.vim.service.IImMessageService;
import org.springframework.stereotype.Service;

/**
 * 聊天信息Service业务层处理
 * 
 * @author 乐天
 * @since 2022-01-25
 */
@Service
public class ImMessageServiceImpl extends ServiceImpl<ImMessageMapper, ImMessage>  implements IImMessageService 
{

}

package com.ruoyi.vim.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ruoyi.vim.domain.ImGroup;
import com.ruoyi.vim.mapper.ImGroupMapper;
import com.ruoyi.vim.service.IImGroupService;
import org.springframework.stereotype.Service;

/**
 * 群管理Service业务层处理
 * 
 * @author 乐天
 * @since 2022-01-26
 */
@Service
public class ImGroupServiceImpl extends ServiceImpl<ImGroupMapper, ImGroup>  implements IImGroupService 
{

    @Override
    public boolean save(ImGroup entity) {
        return super.save(entity);
    }
}

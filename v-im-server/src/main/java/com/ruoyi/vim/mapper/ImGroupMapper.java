package com.ruoyi.vim.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.vim.domain.ImGroup;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 群管理Mapper接口
 *
 * @author 乐天
 * @since 2022-01-26
 */
public interface ImGroupMapper extends BaseMapper<ImGroup> {
    /**
     * 查询用户的群
     *
     * @param userId 用户id
     * @return 群集合
     */
    List<ImGroup> getUserGroups(@Param("userId") String userId);

    /**
     * 查询群的用户
     *
     * @param groupId 群id
     * @param num     数量
     * @return 用户集合
     */
    List<SysUser> getGroupUsers(@Param("groupId") String groupId, @Param("num") Integer num);
}

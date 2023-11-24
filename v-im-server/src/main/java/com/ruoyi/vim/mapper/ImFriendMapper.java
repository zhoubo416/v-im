package com.ruoyi.vim.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ruoyi.api.vo.User;
import com.ruoyi.vim.domain.ImFriend;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 好友Mapper接口
 * 
 * @author ruoyi
 * @since 2022-02-03
 */
public interface ImFriendMapper extends BaseMapper<ImFriend>
{

    /**
     * 根据用户的ID 获取 用户好友(双向用户关系)
     * @param userId 用户ID
     * @return 好友分组的列表
     */
    List<User> getUserFriends(@Param("userId") String userId, @Param("state") String state);

}

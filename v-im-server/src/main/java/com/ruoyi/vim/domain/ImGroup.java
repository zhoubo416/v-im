package com.ruoyi.vim.domain;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.utils.SecurityUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.Date;

/**
 * 群管理对象 im_group
 * 
 * @author 乐天
 * @since 2022-01-26
 */
public class ImGroup extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** ID */
    private String id;

    /** 群名称 */
    @Excel(name = "群名称")
    private String name;

    /** 群头像 */
    @Excel(name = "群头像")
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private String avatar;

    /** 群主 */
    @Excel(name = "群主")
    private String master;

    /** 开启邀请 */
    @Excel(name = "开启邀请")
    private String openInvite;

    /** 审核 */
    @Excel(name = "审核")
    private String inviteCheck;

    /** 公告 */
    @Excel(name = "公告")
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private String announcement;

    @TableLogic(value = "0", delval = "1")
    private String delFlag;

    public void preInsert(){
        this.setCreateBy(String.valueOf(SecurityUtils.getUserId()));
        this.setCreateTime(new Date());
    }

    public void preUpdate(){
        this.setUpdateBy(String.valueOf(SecurityUtils.getUserId()));
        this.setUpdateTime(new Date());
    }
    public void setId(String id) 
    {
        this.id = id;
    }

    public String getId() 
    {
        return id;
    }
    public void setName(String name) 
    {
        this.name = name;
    }

    public String getName() 
    {
        return name;
    }
    public void setAvatar(String avatar) 
    {
        this.avatar = avatar;
    }

    public String getAvatar() 
    {
        return avatar;
    }
    public void setMaster(String master)
    {
        this.master = master;
    }

    public String getMaster()
    {
        return master;
    }

    public String getOpenInvite() {
        return openInvite;
    }

    public void setOpenInvite(String openInvite) {
        this.openInvite = openInvite;
    }

    public void setInviteCheck(String inviteCheck)
    {
        this.inviteCheck = inviteCheck;
    }

    public String getInviteCheck()
    {
        return inviteCheck;
    }
    public void setAnnouncement(String announcement) 
    {
        this.announcement = announcement;
    }

    public String getAnnouncement() 
    {
        return announcement;
    }
    public void setDelFlag(String delFlag) 
    {
        this.delFlag = delFlag;
    }

    public String getDelFlag() 
    {
        return delFlag;
    }



    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("name", getName())
            .append("avatar", getAvatar())
            .append("master", getMaster())
            .append("openInvite", getOpenInvite())
            .append("inviteCheck", getInviteCheck())
            .append("announcement", getAnnouncement())
            .append("createTime", getCreateTime())
            .append("updateTime", getUpdateTime())
            .append("createBy", getCreateBy())
            .append("updateBy", getUpdateBy())
            .append("delFlag", getDelFlag())
            .append("remark", getRemark())
            .toString();
    }
}

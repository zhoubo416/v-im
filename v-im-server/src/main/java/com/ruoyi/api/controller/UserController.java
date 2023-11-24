package com.ruoyi.api.controller;

import com.ruoyi.api.service.VimUserApiService;
import com.ruoyi.api.vo.User;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/sys/users")
public class UserController {

    @Resource
    private VimUserApiService vimUserApiService;

    @Autowired
    private ISysUserService userService;

    @Autowired
    private TokenService tokenService;

    @GetMapping("{userId}")
    public AjaxResult get(@PathVariable String userId) {
        return AjaxResult.success(vimUserApiService.get(userId));
    }

    @GetMapping("my")
    public AjaxResult my() {
        SysUser user = SecurityUtils.getLoginUser().getUser();
        return AjaxResult.success(vimUserApiService.get(String.valueOf(user.getUserId())));
    }

    @GetMapping("search")
    public AjaxResult search(String mobile) {
        return AjaxResult.success(vimUserApiService.search(mobile));
    }

    @GetMapping("searchMatch")
    public AjaxResult searchMatch(String mobile) {
        return AjaxResult.success(vimUserApiService.searchMatch(mobile));
    }


    @PutMapping("update")
    public AjaxResult update(@RequestBody User user) {
        return AjaxResult.success(vimUserApiService.update(user));
    }

    @PutMapping("updatePwd")
    public AjaxResult updatePwd(@RequestBody Pwd pwd) {
        LoginUser loginUser = SecurityUtils.getLoginUser();
        String userName = loginUser.getUsername();
        String password = loginUser.getPassword();
        if (!SecurityUtils.matchesPassword(pwd.getOldPassword(), password)) {
            return AjaxResult.error("修改密码失败，旧密码错误");
        }
        if (SecurityUtils.matchesPassword(pwd.getNewPassword(), password)) {
            return AjaxResult.error("新密码不能与旧密码相同");
        }
        if (userService.resetUserPwd(userName, SecurityUtils.encryptPassword(pwd.getNewPassword())) > 0) {
            // 更新缓存用户密码
            loginUser.getUser().setPassword(SecurityUtils.encryptPassword(pwd.getNewPassword()));
            tokenService.setLoginUser(loginUser);
            return AjaxResult.success();
        }
        return AjaxResult.error("修改密码异常，请联系管理员");
    }


}

class Pwd {
    private String oldPassword;
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
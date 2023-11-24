package com.ruoyi.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ruoyi.api.service.VimDeptApiService;
import com.ruoyi.api.vo.Dept;
import com.ruoyi.vim.domain.VimSysDept ;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.vim.mapper.ImSysDeptMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
 * vim 部门操作类，如果需要对接其他的系统，重新下面的方法即可
 *
 * @author 乐天
 */
@Service
public class VimDeptApiServiceImpl implements VimDeptApiService {

    private static final String CACHE_KEY = "dept";

    @Resource
    private ImSysDeptMapper imSysDeptMapper;

    /**
     * 获取所有的部门
     *
     * @return List<Dept>
     */
    @Override
    public List<Dept> getDepts() {
        return imSysDeptMapper.selectList(new QueryWrapper<>()).stream().map(this::transform).collect(Collectors.toList());
    }

    /**
     * 获取多个部门
     *
     * @param deptIds 多个部门id,逗号分隔
     * @return List<Dept>
     */
    @Override
    public List<Dept> getDepts(String deptIds) {
        if (StringUtils.isNotBlank(deptIds)) {
            QueryWrapper<VimSysDept> wrapper = new QueryWrapper<>();
            wrapper.in("dept_id", deptIds.split(","));
            List<VimSysDept> sysDepts = imSysDeptMapper.selectList(wrapper);
            return sysDepts.stream().map(this::transform).collect(Collectors.toList());
        }
        return null;
    }

    /**
     * 获取部门
     *
     * @param deptId 门id
     * @return Dept
     */
    @Override
    @Cacheable(value = CACHE_KEY + ":one", key = "#deptId")
    public Dept get(String deptId) {
        QueryWrapper<VimSysDept> wrapper = new QueryWrapper<>();
        wrapper.eq("dept_id", deptId);
        return transform(imSysDeptMapper.selectOne(wrapper));
    }

    /**
     * 部门类型转换 SysDept -> Dept
     *
     * @param dept 部门
     * @return Dept
     */
    private Dept transform(VimSysDept dept) {
        return new Dept(String.valueOf(dept.getDeptId()), String.valueOf(dept.getParentId()), dept.getAncestors(), dept.getDeptName(), String.valueOf(dept.getOrderNum()));
    }
}

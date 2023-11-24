package com.ruoyi.task;

import cn.hutool.core.util.StrUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import javax.annotation.Resource;
import java.util.Set;

/**
 * 定时任务，定时清理redis 里面的多余数据
 *
 * @author z
 */
@Configuration      //1.主要用于标记配置类，兼备Component的效果。
@EnableScheduling   // 2.开启定时任务
public class MessageClearTask {

    private final Logger logger = LoggerFactory.getLogger(MessageClearTask.class);
    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 定时任务，redis 里面只保留最新100条数据
     * 每天2点开始执行
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void clearRedisMessage() {
        System.out.println("开始定时任务");
        Set<String> keys = redisTemplate.keys("message-*");
        for (String key : keys) {
            Long count = redisTemplate.opsForZSet().count(key, 0, System.currentTimeMillis()) - 100;
            if(count>0){
                Long res = redisTemplate.opsForZSet().removeRange(key, 0, count);
                logger.info(StrUtil.format("{}:共清理了{}条数据", key,res));
            }
        }
    }
}

/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50718
Source Host           : localhost:3306
Source Database       : ry-vue-1

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2023-07-06 09:28:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for im_friend
-- ----------------------------
DROP TABLE IF EXISTS `im_friend`;
CREATE TABLE `im_friend` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `friend_id` bigint(20) NOT NULL COMMENT '用户id',
  `state` char(1) DEFAULT NULL COMMENT '审核状态',
  `message` varchar(255) DEFAULT NULL COMMENT '信息',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `create_by` bigint(20) DEFAULT NULL,
  `update_by` bigint(20) DEFAULT NULL,
  `del_flag` char(1) NOT NULL DEFAULT '0',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index2` (`user_id`,`friend_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1673251663894937603 DEFAULT CHARSET=utf8mb4;



-- ----------------------------
-- Table structure for im_group
-- ----------------------------
DROP TABLE IF EXISTS `im_group`;
CREATE TABLE `im_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '群名称',
  `avatar` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '群头像',
  `master` bigint(20) DEFAULT NULL COMMENT '群主',
  `announcement` varchar(1000) DEFAULT NULL COMMENT '公告',
  `open_invite` char(1) DEFAULT '0' COMMENT '允许他人邀请',
  `invite_check` char(1) DEFAULT NULL COMMENT '邀请需要审核吗？',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `create_by` bigint(20) DEFAULT NULL,
  `update_by` bigint(20) DEFAULT NULL,
  `del_flag` char(1) NOT NULL DEFAULT '0',
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1676406363377041411 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for im_group_user
-- ----------------------------
DROP TABLE IF EXISTS `im_group_user`;
CREATE TABLE `im_group_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` bigint(20) NOT NULL COMMENT '群id ',
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `state` char(1) DEFAULT NULL COMMENT '审核状态',
  `message` varchar(255) DEFAULT NULL COMMENT '申请信息',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `create_by` bigint(20) DEFAULT NULL,
  `update_by` bigint(20) DEFAULT NULL,
  `del_flag` char(1) NOT NULL DEFAULT '0',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1676406702872395779 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for im_message
-- ----------------------------
DROP TABLE IF EXISTS `im_message`;
CREATE TABLE `im_message` (
  `id` bigint(20) NOT NULL,
  `to_id` bigint(20) DEFAULT NULL COMMENT '接收人',
  `from_id` bigint(20) DEFAULT NULL COMMENT '发送人',
  `send_time` bigint(20) DEFAULT NULL COMMENT '发送时间',
  `content` varchar(4000) CHARACTER SET utf8 DEFAULT NULL COMMENT '内容',
  `extend` text COMMENT '扩展',
  `message_type` char(1) CHARACTER SET utf8 DEFAULT NULL COMMENT '类型',
  `chat_key` varchar(64) DEFAULT NULL COMMENT '聊天室KEY',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `to_id` (`to_id`),
  KEY `from_id` (`from_id`),
  KEY `message_type` (`message_type`),
  KEY `send_time` (`send_time`),
  KEY `chat_key` (`chat_key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


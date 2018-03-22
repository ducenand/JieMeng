/*
 Source Database       : test

 Target Server Type    : MySQL
 Target Server Version : 50556
 File Encoding         : utf-8

 Date: 03/22/2018 09:49:33 AM
*/

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `class`
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `gid` int(11) NOT NULL DEFAULT '0' COMMENT '分组id',
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '分类名称',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `details`
-- ----------------------------
DROP TABLE IF EXISTS `details`;
CREATE TABLE `details` (
  `did` int(11) NOT NULL AUTO_INCREMENT COMMENT '详情id',
  `cid` int(11) DEFAULT '0' COMMENT '类id',
  `gid` int(11) DEFAULT '0' COMMENT '组id',
  `kid` int(11) DEFAULT NULL COMMENT '关键词id',
  `detail` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `group`
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `gid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分组id',
  `group` varchar(100) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '分组名称',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `keywords`
-- ----------------------------
DROP TABLE IF EXISTS `keywords`;
CREATE TABLE `keywords` (
  `kid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) DEFAULT '0' COMMENT '分组id',
  `keyword` varchar(200) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '关键字',
  `cid` int(11) DEFAULT '0' COMMENT '分类id',
  `href` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

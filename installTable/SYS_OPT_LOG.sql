DROP TABLE IF EXISTS SYS_OPT_LOG;
CREATE TABLE SYS_OPT_LOG (
  LOG_ID bigint NOT NULL auto_increment   ,
  OPT_TYPE varchar(20)  DEFAULT NULL COMMENT '操作类型',
  OPT_URL varchar(255) DEFAULT NULL COMMENT '操作url地址',
  OPT_REMARK varchar(255)   DEFAULT NULL COMMENT '操作备注',
  OPT_METHOD varchar(255)   DEFAULT NULL COMMENT '操作方法',
  OPT_PARAM text  DEFAULT NULL COMMENT '操作参数',
  USER_ID bigint(20)   DEFAULT NULL COMMENT '用户编号',
  IP_ADDRESS varchar(15)   DEFAULT NULL COMMENT '执行者ip',
  OPT_STATUS varchar(2)   DEFAULT NULL COMMENT '操作状态 S-成功 F-失败',
  ERR_MSG text  DEFAULT NULL COMMENT '错误消息',
  SYS_TIME varchar(20)   DEFAULT NULL COMMENT '操作时间',
  primary key(LOG_ID)
);
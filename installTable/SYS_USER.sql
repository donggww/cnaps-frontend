drop table if exists SYS_USER;
CREATE TABLE SYS_USER (
                          ID                BIGINT       PRIMARY KEY AUTO_INCREMENT,
                          USERNAME          VARCHAR(50)  NOT NULL UNIQUE COMMENT '操作员号',
                          PASSWORD          VARCHAR(255) NOT NULL COMMENT '登录密码(BCrypt加密)',
                          REAL_NAME         VARCHAR(100) COMMENT '真实姓名',
                          INSTITUTION_CODE  VARCHAR(20)  COMMENT '接入机构代码',
                          INSTITUTION_NAME  VARCHAR(100) COMMENT '接入机构名称',
                          ENVIRONMENT       VARCHAR(10)  DEFAULT 'SIT' COMMENT '运行环境 FAT/SIT/UAT',
                          ROLE              VARCHAR(20)  DEFAULT 'user' COMMENT '角色: admin/user',
                          STATUS            TINYINT      DEFAULT 1 COMMENT '状态: 1启用 0禁用',
                          CREATED_AT        DATETIME     DEFAULT CURRENT_TIMESTAMP,
                          UPDATED_AT        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
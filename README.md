# 业务开发常见问题

| Q | A |
| :-: | :-: |
| 自定义`button`组件前置后置按钮 | 使用 `iconify` 图标，格式为 `ant-design:` + 图标名。参考 [组件](/src/views/archives/powerCutConfig/operationTicket/components/stepForm.vue) |
| `select` 组件搜索功能查到的结果不对 | 是因为 antd 默认查找的是`value`的值，添加`optionFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段 |
| `treeSelect` 组件搜索功能查到的结果不对 | 原因同上，添加`treeNodeFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段 |
| 表格嵌套表单提交 | 参考[停送电配置 >> 高压操作票 >> 配置步骤](/src/views/archives/powerCutConfig/operationTicket/index.vue) |
| 上传图片 | 参考[停送电配置 >> 供电系统图 >> 新建编辑](/src/views/archives/powerCutConfig/powerSystemList/editModal.vue) |
| ApiSelect 无默认值时，初次选择导致表单检验错误 | 增加`itemProps: { validateTrigger: 'blur' }`配置,参考[新建停送电申请单](src/views/powerFailure/editPowerCutData.ts) |

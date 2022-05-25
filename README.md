# 业务开发常见问题

1. <details>
   <summary>select 组件搜索功能查到的结果不对</summary>

   是因为 antd 默认查找的是`value`的值，添加`optionFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段
   </details>

2. <details>
   <summary>treeSelect 组件搜索功能查到的结果不对</summary>

   原因同上，添加`treeNodeFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段
   </details>

3. <details>
   <summary> 表格嵌套表单提交 </summary>

   参考[停送电配置 >> 高压操作票 >> 配置步骤](/src/views/archives/powerCutConfig/operationTicket/index.vue)
   </details>

4. <details>
   <summary>  上传图片 </summary>

   参考[停送电配置 >> 供电系统图 >> 新建编辑](/src/views/archives/powerCutConfig/powerSystemList/editModal.vue)
   </details>

5. <details>
   <summary> 自定义`button`组件前置后置按钮 </summary>

   使用 `iconify` 图标，格式为 `ant-design:` + 图标名。参考 [组件](/src/views/archives/powerCutConfig/operationTicket/components/stepForm.vue)
   </details>

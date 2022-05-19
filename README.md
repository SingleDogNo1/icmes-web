# 业务开发常见问题

1. <details>
   <summary>select 组件搜索功能查到的结果不对</summary>

   是因为 antd 默认查找的是`value`的值，添加`optionFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段
   </details>

2. <details>
   <summary>treeSelect 组件搜索功能查到的结果不对</summary>

   原因同上，添加`treeNodeFilterProp: 'label'`按照 label 查找，如果重定向了 `label`注意替换为重定向的字段
   </details>

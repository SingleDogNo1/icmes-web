# 写在前面

::: warning 注意事项

开发环境下会生成所有组件的示例，并且示例不参与打包。文档结合示例文件更佳

:::

## Usage

该项目的组件全部采用按需引入注册方式(`Input`、`Button`除外)，如下

```vue
<template>
  <ConfigProvider>
    <router-view />
  </ConfigProvider>
  <a-input v-model:value="input" />
  <a-button> button </a-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  export default defineComponent({
    name: 'App',
    components: { ConfigProvider },
    setup() {
      return {
        input: '',
      };
    },
  });
</script>
```

<template>
  <div :class="prefixCls">
    <Badge
      :count="count"
      :offset="[-5, 15]"
      @click="go({ name: 'TaskBoard', query: { tab: 'task' } })"
    >
      <Icon icon="whh:notestasks" size="18" />
    </Badge>
  </div>
</template>
<script lang="ts" setup>
  import { Badge } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  defineProps({
    count: {
      type: Number,
      required: true,
    },
  });

  const { prefixCls } = useDesign('header-task');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-task';

  .@{prefix-cls} {
    padding-top: 2px;

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>

<template>
  <BasicTree
    :treeData="(treeData as any)"
    ref="treeRef"
    :checkable="true"
    :replace-fields="{ title: 'label', key: 'id' }"
    :default-expand-level="1"
    :checked-keys="checkedKeys"
    :disabled="disabled"
  />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { useUserStore, FeaturesTreeModel } from '/@/store/modules/user';

  const { getFeaturesTree: features } = useUserStore();

  const treeData: FeaturesTreeModel[] = [
    {
      id: '-1',
      label: '全部功能',
      isFeature: false,
      children: features,
    },
  ];

  console.log('treeData :>> ', treeData);

  defineProps({
    disabled: {
      /** 是否不可编辑 */
      type: Boolean,
      default: false,
    },
    checkedKeys: {
      type: Array as PropType<string[] | number[]>,
      default: () => [],
    },
  });

  const treeRef = ref<Nullable<TreeActionType>>(null);
</script>

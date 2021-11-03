<template>
  <BasicTree
    :treeData="treeData"
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
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import { useUserStore, FeaturesTreeModel } from '/@/store/modules/user';

  const userStore = useUserStore();

  const features = userStore.getFeaturesTree;

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
      default: true,
    },
    checkedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const treeRef = ref<Nullable<TreeActionType>>(null);
</script>

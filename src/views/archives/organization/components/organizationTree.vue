<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <!-- <a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新增角色</a-button> -->
      <a-button class="mb-2.5 mr-4" type="primary">新建同级</a-button>
      <a-button class="mb-2.5" type="primary">新建子集</a-button>
      <PageWrapper contentFullHeight fixedHeight dense>
        <Spin :spinning="loading">
          <BasicTree
            :treeData="treeData"
            :replaceFields="{ key: 'id' }"
            ref="treeRef"
            @select="handleSelect"
          />
        </Spin>
      </PageWrapper>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'Tree',
  };
</script>

<script lang="ts" setup>
  import { nextTick, ref, unref } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getOrganizationsListApi } from '/@/api/info/organizations';
  import { OrganizationsFullNameModel } from '/@/api/info/model/organizationsModel';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['select']);

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeData = ref([]);
  const loading = ref(false);

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) throw new Error('tree is null!');
    return tree;
  }

  async function getOrganizationsList(params) {
    loading.value = true;
    try {
      const { items } = await getOrganizationsListApi(params);
      // 给列表赋值 title 用于显示标题。除根节点（parentId === -1）外，子目录和部门均显示为 code + name
      const list: (OrganizationsFullNameModel & { title?: string })[] = cloneDeep(items) || [];
      list.map((item) => {
        item.title = item.parentId === -1 ? item.name : `${item.code} ${item.name}`;
      });
      treeData.value = listToTreeAsParentId(list);
      await nextTick();
      // 展开第一层 & 选中根节点（id === 0）
      getTree()?.filterByLevel(1);
      getTree()?.setSelectedKeys([0]);
      emit('select', 0);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  function handleSelect(ids) {
    // 默认的结果为数组结构，但是项目中为单选，所以直接取出来即可
    console.log('ids :>> ', ids);
    emit('select', ids[0]);
  }

  getOrganizationsList({
    parentId: 0,
    orderBy: 'Code',
    ascending: true,
  });
</script>

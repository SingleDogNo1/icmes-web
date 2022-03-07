<template>
  <BasicModal
    v-bind="$attrs"
    width="75%"
    :height="600"
    title="编辑用户角色"
    @register="register"
    destroy-on-close
    @ok="handleSubmit"
  >
    <Row :gutter="16" class="h-full">
      <Col :span="8" class="h-full overflow-hidden">
        <BasicTree
          class="border"
          ref="treeRef"
          search
          :treeData="treeData"
          :loading="loading"
          :replace-fields="{ key: 'id' }"
        />
      </Col>
      <Col :span="16">
        <BasicTable @register="registerTable" :loading="loading" :max-height="500" />
      </Col>
    </Row>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, nextTick } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getOrganizationsListApi } from '/@/api/info/organizations';
  import { getRolesListApi } from '/@/api/account/roles';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const emit = defineEmits(['submit']);

  const loading = ref<boolean>(false);
  const treeData = ref<any[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const getRolesListParams = ref({
    ascending: true,
    orderBy: 'code',
    pageNo: 1,
    pageSize: 10,
  });

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  const [registerTable, { setTableData, getPaginationRef, setPagination, getSelectRows }] =
    useTable({
      columns: [
        { title: '姓名', dataIndex: 'name', fixed: 'left' },
        { title: '描述', dataIndex: 'remark' },
      ],
      rowSelection: { type: 'radio' },
      onChange: async () => {
        loading.value = true;
        const page = getPaginationRef() as PaginationProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });
        const params = {
          ...getRolesListParams.value,
          ...{ pageNo: page.current, pageSize: page.pageSize },
        };

        try {
          const { items, totalCount } = await getRolesListApi(params);
          setTableData(items || []);
          setPagination({ total: totalCount });
        } catch (error: any) {
          throw new Error(error);
        } finally {
          loading.value = false;
        }
      },
    });

  const [register, { closeModal }] = useModalInner(async () => {
    loading.value = true;
    try {
      const { items: list } = await getOrganizationsListApi({});
      list?.map((item) => {
        // 添加字段 title，用于 Tree 组件
        (item as unknown as { [index: string]: string }).title = item.code + item.name;
      });

      treeData.value = listToTreeAsParentId(list || []);
      await nextTick();
      getTree().expandAll(true);
      // 默认选中根目录，根目录 id 固定为 0
      getTree().setSelectedKeys([0]);

      const { items: roles, totalCount } = await getRolesListApi(getRolesListParams.value);
      setTableData(roles || []);
      setPagination({
        total: totalCount,
      });
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });

  function handleSubmit() {
    const orgIdArr = getTree().getSelectedKeys();
    const roleIdArr = getSelectRows();
    if (!orgIdArr.length) {
      createMessage.error('请选择机构名称');
      return;
    }
    if (!roleIdArr.length) {
      createMessage.error('请选择用户角色');
      return;
    }

    emit('submit', { orgId: orgIdArr[0], roleId: roleIdArr[0].id });
    closeModal();
  }
</script>

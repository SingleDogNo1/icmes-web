<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <Tabs type="card">
        <TabPane key="permission" tab="用户权限">
          <PageWrapper contentFullHeight dense>
            <RoleTree :disabled="true" :checked-keys="rowPermission" />
          </PageWrapper>
        </TabPane>
        <TabPane key="member" tab="用户列表" forceRender>
          <PageWrapper contentFullHeight dense>
            <BasicTable @register="registerTable" @row-click="handleClickRow" />
          </PageWrapper>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { RoleTree } from '/@/components/Business';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { GetAccountOrgResultModel, RoleModel } from '/@/api/account/model/rolesModel';

  const TabPane = Tabs.TabPane;

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedRow: {
      type: Object as PropType<Nullable<RoleModel>>,
      required: true,
    },
    rowPermission: {
      type: Object as PropType<string[]>,
      required: true,
    },
    rowUserData: {
      type: Object as PropType<Nullable<GetAccountOrgResultModel>>,
      required: true,
    },
  });

  const emit = defineEmits(['changePage']);

  const selectedRowIndex = ref<number>(-1);

  const [registerTable, { setTableData, getPaginationRef, getDataSource, setPagination }] =
    useTable({
      columns: [
        { title: '工号(账号)', dataIndex: 'code', fixed: 'left' },
        { title: '姓名', dataIndex: 'name' },
        { title: '组织机构', dataIndex: 'fullOrgName' },
      ],
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
      },
      onChange: () => {
        const page = getPaginationRef() as PaginationProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });
        emit('changePage', { pageNo: page.current, pageSize: page.pageSize });
      },
    });

  function handleClickRow(_, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  watch(
    () => props.rowUserData,
    (value) => {
      setTableData(value?.items || []);
      if (value?.items) {
        // 有数据，默认选中第一条
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
      setPagination({
        total: value?.totalCount,
      });
    },
  );

  // 选中的角色类型发生变化，执行操作
  watch(
    () => props.selectedRow,
    () => {
      // 分页重置
      setPagination({
        current: 1,
      });
    },
    {
      deep: true,
    },
  );
</script>

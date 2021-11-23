<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新增角色</a-button>
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>
    <EditRolesModal
      :active-row="selectedRow"
      @register="registerModal"
      @update:role="getRolesList(props.searchData)"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { getRolesListApi, deleteRoleApi } from '/@/api/account/roles';
  import { GetRoleListParams, RoleModel } from '/@/api/account/model/rolesModel';
  import EditRolesModal from './editRolesModal.vue';
  import { useModal } from '/@/components/Modal';

  const props = defineProps({
    searchData: {
      type: Object as PropType<GetRoleListParams>,
      required: true,
    },
  });

  const emit = defineEmits(['selectRow', 'changePage']);

  const selectedRowIndex = ref<number>(-1);
  const selectedRow = ref({});

  const loading = ref(false);

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        { title: '角色编码', dataIndex: 'code', fixed: 'left' },
        { title: '角色名称', dataIndex: 'name' },
        { title: '角色描述', dataIndex: 'remark' },
      ],
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'row__active' : '';
      },
      actionColumn: {
        width: 160,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
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

  const [registerModal, { openModal }] = useModal();

  watch(
    () => props.searchData,
    (value) => {
      getRolesList(value);
      setPagination({
        current: value.pageNo,
      });
    },
    {
      deep: true,
    },
  );

  function createActions(record: RoleModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, record);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            deleteRoleApi(record.id)
              .then(() => {
                createMessage.success('删除成功');
                getRolesList(props.searchData);
              })
              .catch((error) => {
                console.log('error :>> ', JSON.stringify(error));
              });
          },
        },
      },
    ];
  }

  function getRolesList(form) {
    loading.value = true;
    getRolesListApi(form)
      .then((data) => {
        setTableData(data.items || []);
        if (data.items) {
          // 有数据，默认选中第一条，查询详情
          selectedRowIndex.value = -1;
          const tableData = getDataSource();
          handleClickRow(tableData[0], 0);
        }
        setPagination({
          total: data.totalCount,
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    emit('selectRow', row);
    selectedRowIndex.value = index;
    selectedRow.value = row;
  }
</script>

<style scoped lang="less">
  // 点击表格高亮当前行
  @activeClass: row__active;

  ::v-deep(.@{activeClass}) {
    &:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: #e3f4fc;
    }
  }
</style>

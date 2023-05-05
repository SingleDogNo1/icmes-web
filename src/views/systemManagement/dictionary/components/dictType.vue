<template>
  <PageWrapper contentFullHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新建</a-button>
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>
    <EditDictTypeModal
      @register="registerModal"
      @update:dict="getDictTypesList(props.searchData)"
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
  import { getDictTypesListApi, deleteDictTypeApi } from '/@/api/info/dict';
  import { GetDictTypesParam } from '/@/api/info/model/dictModel';
  import EditDictTypeModal from './editDictTypeModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const props = defineProps({
    searchData: {
      type: Object as PropType<GetDictTypesParam>,
      required: true,
    },
  });

  const emit = defineEmits(['selectRow', 'changePage']);

  const selectedRowIndex = ref<number>(-1);

  const loading = ref(false);

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        { title: '类型编码', dataIndex: 'code', fixed: 'left' },
        { title: '类型编码', dataIndex: 'name' },
      ],
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
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
      getDictTypesList(value);
      if (value) {
        setPagination({
          current: value.pageNo,
        });
      }
    },
    {
      deep: true,
    },
  );

  function createActions(record): ActionItem[] {
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
          confirm: async () => {
            loading.value = false;
            try {
              await deleteDictTypeApi(record.code);
              createMessage.success('删除成功');
              await getDictTypesList(props.searchData);
            } catch (err: any) {
              error(err);
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  async function getDictTypesList(form) {
    loading.value = true;

    try {
      const { items, totalCount } = await getDictTypesListApi(form);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 有数据，默认选中第一条，查询详情
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    emit('selectRow', row);
    selectedRowIndex.value = index;
  }
</script>

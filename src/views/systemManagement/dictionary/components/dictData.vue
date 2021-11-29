<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新增字典</a-button>
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #lastUpdateTime="{ record }">
          {{ formatDate(record.lastUpdateTime, 'YYYY-MM-DD HH:mm') }}
        </template>
        <template #disabled="{ record }">
          {{ record.disabled ? '禁用' : '启用' }}
        </template>
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>
    <EditDictDataModal
      @register="registerModal"
      :dict-type="props.selectRow.typeCode"
      @update:data="getDictTypesList(props.selectRow)"
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
    ActionItem,
    PaginationProps,
  } from '/@/components/Table';
  import {
    getDictDataApi,
    enabledDictDataApi,
    disabledDictDataApi,
    deleteDictDataApi,
  } from '/@/api/info/dict';
  import { GetDictDataParam, DictDataModel } from '/@/api/info/model/dictModel';
  import EditDictDataModal from './editDictDataModal.vue';
  import { useModal } from '/@/components/Modal';
  import { formatDate } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const props = defineProps({
    selectRow: {
      type: Object as PropType<GetDictDataParam>,
      required: true,
    },
  });

  const loading = ref(false);
  const selectedRowIndex = ref<number>(-1);

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        { title: '字典编码', dataIndex: 'code', fixed: 'left' },
        { title: '字典名称', dataIndex: 'name' },
        { title: '顺序号', dataIndex: 'order', width: 70 },
        { title: '更新人', dataIndex: 'updateUserName', width: 90 },
        {
          title: '更新时间',
          dataIndex: 'lastUpdateTime',
          slots: { customRender: 'lastUpdateTime' },
          width: 140,
        },
        {
          title: '状态',
          dataIndex: 'disabled',
          slots: { customRender: 'disabled' },
          width: 60,
        },
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

        Object.assign(props.selectRow, {
          pageNo: page.current,
          pageSize: page.pageSize,
        });
      },
    });

  const [registerModal, { openModal }] = useModal();

  watch(
    () => props.selectRow,
    (value) => {
      getDictTypesList(value);
      setPagination({
        current: value.pageNo,
      });
    },
    {
      deep: true,
    },
  );

  function createActions(record: DictDataModel): ActionItem[] {
    if (!record.disabled) {
      return [
        {
          label: '编辑',
          onClick: () => {
            openModal(true, record);
          },
        },
        {
          label: '禁用',
          popConfirm: {
            title: '是否确认禁用？',
            confirm: async () => {
              loading.value = true;
              try {
                await disabledDictDataApi(record.typeCode, record.code, {
                  versionTag: record.versionTag,
                });
                createMessage.success('禁用成功');
                await getDictTypesList(props.selectRow);
              } catch (error) {
                console.log('error :>> ', error);
              } finally {
                loading.value = false;
              }
            },
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: async () => {
              loading.value = true;
              try {
                await deleteDictDataApi(record.typeCode, record.code);
                createMessage.success('删除成功');
                await getDictTypesList(props.selectRow);
              } catch (error) {
                console.log('error :>> ', error);
              } finally {
                loading.value = false;
              }
            },
          },
        },
      ];
    } else {
      return [
        {
          label: '启用',
          popConfirm: {
            title: '是否确认启用？',
            confirm: async () => {
              loading.value = true;

              try {
                await enabledDictDataApi(record.typeCode, record.code, {
                  versionTag: record.versionTag,
                });
                createMessage.success('启用成功');
                await getDictTypesList(props.selectRow);
              } catch (error) {
                console.log('error :>> ', error);
              } finally {
                loading.value = false;
              }
            },
          },
        },
      ];
    }
  }

  async function getDictTypesList(form) {
    loading.value = true;
    try {
      const { items, totalCount } = await getDictDataApi(form);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 有数据，默认选中第一条，查询详情
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(_, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }
</script>

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
        <template #action="{ record, column }">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </BasicTable>
    </div>
    <EditDictDataModal @register="registerModal" :dict-type="props.selectRow.typeCode" />
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
  import {
    GetDictDataParam,
    DisabledDictDataParam,
    EnabledDictDataParam,
  } from '/@/api/info/model/dictModel';
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
  const disabledDictDataParam = ref({}) as Ref<DisabledDictDataParam>;
  const enabledDictDataParam = ref({}) as Ref<EnabledDictDataParam>;

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

  function createActions(record): ActionItem[] {
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
            confirm: () => {
              disabledDictDataParam.value.versionTag = record.versionTag;
              disabledDictDataApi(record.typeCode, record.code, disabledDictDataParam.value).then(
                () => {
                  createMessage.success('禁用成功');
                  getDictTypesList(props.selectRow);
                },
              );
            },
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: () => {
              deleteDictDataApi(record.typeCode, record.code).then(() => {
                createMessage.success('删除成功');
                getDictTypesList(props.selectRow);
              });
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
            confirm: () => {
              enabledDictDataParam.value.versionTag = record.versionTag;
              enabledDictDataApi(record.typeCode, record.code, enabledDictDataParam.value).then(
                () => {
                  createMessage.success('启用成功');
                  getDictTypesList(props.selectRow);
                },
              );
            },
          },
        },
      ];
    }
  }

  function getDictTypesList(form) {
    loading.value = true;
    getDictDataApi(form)
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

  function handleClickRow(_, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
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

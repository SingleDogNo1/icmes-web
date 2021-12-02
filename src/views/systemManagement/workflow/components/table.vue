<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #toolbar>
          <a-button type="primary" @click="openModal(true, {})">新增账号</a-button>
        </template>

        <template #businessType="{ record }">
          <span>{{ businessTypeMap[record.businessType] }}</span>
        </template>

        <template #isDeploy="{ record }">
          <div v-if="record.isDeploy">
            <AlertTwoTone two-tone-color="red" />
            <span class="ml-2.5">已发布</span>
          </div>
          <div v-else>
            <AlertTwoTone two-tone-color="blue" />
            <span class="ml-2.5">未发布</span>
          </div>
        </template>

        <template #action="{ record }">
          <TableAction
            :actions="createActions(record)"
            :dropDownActions="createDropDownActions(record)"
          />
        </template>
      </BasicTable>
    </div>
    <EditWorkflowModal @register="registerModal" @done="getWorkflowsList(props.searchData)" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  // TODO 咱们这个灯能不能导出成 SVG 格式，可以省很多事
  import { AlertTwoTone } from '@ant-design/icons-vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { delWorkflowApi, getWorkflowsListApi, publishWorkflowApi } from '/@/api/flow/workflow';
  import { GetWorkflowsListParam, WorkFlowModel } from '/@/api/flow/model/workflowModel';
  import { workflowListTableColumns } from '../data';
  import { useUserState } from '/@/hooks/web/useUserState';
  import EditWorkflowModal from './editWorkflowModal.vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const { getDictMap } = useUserState();

  const props = defineProps({
    searchData: {
      type: Object as PropType<GetWorkflowsListParam>,
      required: true,
    },
  });

  const emit = defineEmits(['selectRow', 'changePage']);
  const selectedRowIndex = ref<number>(-1);
  const loading = ref(false);

  // 业务类型
  const businessTypeMap = getDictMap('DT_BUSINESS_TYPE');

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: workflowListTableColumns,
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
      },
      actionColumn: {
        width: 120,
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

  function createActions(record: WorkFlowModel): ActionItem[] {
    if (record.isDeploy) {
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
              handleDelData(record);
            },
          },
        },
      ];
    } else {
      return [
        {
          label: '发布',
          popConfirm: {
            title: '确认发布该工作流？',
            confirm: async () => {
              loading.value = true;
              try {
                await publishWorkflowApi(record.id);
                createMessage.success('发布成功');
                await getWorkflowsList(props.searchData);
              } catch (error) {
                throw new Error(JSON.stringify(error));
              } finally {
                loading.value = false;
              }
            },
          },
        },
      ];
    }
  }

  function createDropDownActions(record: WorkFlowModel): ActionItem[] {
    if (record.isDeploy) {
      return [];
    } else {
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
              handleDelData(record);
            },
          },
        },
      ];
    }
  }

  async function getWorkflowsList(form) {
    loading.value = true;
    try {
      const { items, totalCount } = await getWorkflowsListApi(form);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 有数据，默认选中第一条，查询详情
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
    emit('selectRow', row);
  }

  async function handleDelData(record: WorkFlowModel) {
    loading.value = true;
    try {
      await delWorkflowApi(record.id);
      createMessage.success('删除成功');
      await getWorkflowsList(props.searchData);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => props.searchData,
    (value) => {
      getWorkflowsList(value);
      setPagination({
        current: value.pageNo,
      });
    },
    {
      deep: true,
    },
  );
</script>

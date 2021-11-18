<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新增账号</a-button>
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #employeeId="{ record }">
          <LockTwoTone twoToneColor="#f00" v-if="record.locked" />
          <UnlockTwoTone twoToneColor="#ace" v-else />
          <span class="ml-2">{{ record.employeeCode }}</span>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="createActions(record)"
            :dropDownActions="createDropDownActions(record)"
          />
        </template>
      </BasicTable>
    </div>
    <EditUserModal @register="registerModal" @update:user="getAccountList(props.searchData)" />
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
  import { useModal } from '/@/components/Modal';
  import {
    getAccountListApi,
    deleteAccountByIdApi,
    lockAccountByIdApi,
    unlockAccountByIdApi,
    resetPasswordByIdApi,
    resetFaceByIdApi,
  } from '/@/api/account/basic';
  import { GetAccountListParams, AccountModel } from '/@/api/account/model/basicModel';
  import { LockTwoTone, UnlockTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EditUserModal from './editUserModal.vue';

  const { createMessage } = useMessage();

  const props = defineProps({
    searchData: {
      type: Object as PropType<GetAccountListParams>,
      required: true,
    },
  });

  const emit = defineEmits(['selectRow', 'changePage']);

  const selectedRowIndex = ref<number>(-1);

  const loading = ref(false);

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        {
          title: '工号(账号)',
          dataIndex: 'employeeId',
          slots: { customRender: 'employeeId' },
          fixed: 'left',
        },
        { title: '姓名', dataIndex: 'name' },
        { title: '专网手机号', dataIndex: 'specialDevice' },
      ],
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'row__active' : '';
      },
      actionColumn: {
        width: 220,
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
      getAccountList(value);
      setPagination({
        current: value.pageNo,
      });
    },
    {
      deep: true,
    },
  );

  function createActions(record: AccountModel): ActionItem[] {
    if (record.locked) {
      return [
        {
          label: '解除锁定',
          popConfirm: {
            title: '是否确认解除锁定？',
            confirm: () => {
              console.log('解除锁定 :>> ', record);
              loading.value = true;
              unlockAccountByIdApi(record.employeeId)
                .then(() => {
                  loading.value = false;
                  createMessage.success('解除锁定成功！');
                  getAccountList(props.searchData);
                })
                .catch((error) => {
                  loading.value = false;
                  createMessage.error(error);
                });
            },
          },
        },
      ];
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
            confirm: () => {
              loading.value = true;
              deleteAccountByIdApi(record.employeeId)
                .then(() => {
                  loading.value = false;
                  createMessage.success('删除成功！');
                  getAccountList(props.searchData);
                })
                .catch((error) => {
                  loading.value = false;
                  createMessage.error(error);
                });
            },
          },
        },
        {
          label: '锁定',
          popConfirm: {
            title: '是否确认锁定？',
            confirm: () => {
              loading.value = true;
              lockAccountByIdApi(record.employeeId)
                .then(() => {
                  loading.value = false;
                  createMessage.success('锁定成功！');
                  getAccountList(props.searchData);
                })
                .catch((error) => {
                  loading.value = false;
                  createMessage.error(error);
                });
            },
          },
        },
      ];
    }
  }
  function createDropDownActions(record: AccountModel): ActionItem[] {
    if (record.locked) {
      return [];
    } else {
      return [
        {
          label: '初始化密码',
          popConfirm: {
            title: '密码将重置为123456，是否确认？',
            confirm: () => {
              loading.value = true;
              resetPasswordByIdApi(record.employeeId)
                .then(() => {
                  loading.value = false;
                  createMessage.success('密码初始化成功');
                })
                .catch((error) => {
                  loading.value = false;
                  createMessage.error(error);
                });
            },
          },
        },
        {
          label: '初始化人脸',
          popConfirm: {
            title: '是否确定初始化人脸？',
            confirm: () => {
              console.log('record :>> ', record);
              loading.value = true;
              resetFaceByIdApi(record.employeeId)
                .then(() => {
                  loading.value = false;
                  createMessage.success('初始化人脸成功');
                })
                .catch((error) => {
                  loading.value = false;
                  createMessage.error(error);
                });
            },
          },
        },
      ];
    }
  }

  function getAccountList(form) {
    loading.value = true;
    getAccountListApi(form)
      .then((data) => {
        console.log('data :>> ', data);
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

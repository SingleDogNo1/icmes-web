<template>
  <BasicForm :class="`${prefixCls}-form`" @register="registerForm" @submit="searchTableData" />

  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, {})">新建</a-button>
    </template>

    <template #images="{ record }">
      <a-button type="primary" size="small" @click="() => setVisible(record, true)">
        {{ record.photoName }}
      </a-button>
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <Image
    :width="200"
    :style="{ display: 'none' }"
    :preview="{ visible, onVisibleChange: setVisible }"
    :src="imageSrc"
  />

  <EditModal @register="registerModal" @done="searchTableData" />
</template>

<script lang="ts">
  export default {
    name: 'PowerSystemList',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { Image } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { schemas, columns } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getDevicePowerSupplyPhotoListApi } from '/@/api/info/devicePowerSupplyPhoto';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import EditModal from './editModal.vue';

  const { prefixCls } = useDesign('power-system-list');
  const { apiUrl } = useGlobSetting();
  const { getToken: token } = useUserStore();
  const loading = ref(false);
  const visible = ref(false);
  const imageSrc = ref('');
  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    labelWidth: 0,
  });
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    ellipsis: false,
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
      const values = getFieldsValue();

      const params = { ...values, ...{ pageNo: page.current, pageSize: page.pageSize } };
      getDevicePowerSupplyPhotoList(params);
    },
  });

  onMounted(() => {
    searchTableData();
  });

  function setVisible(record, value?) {
    if (record && value) {
      imageSrc.value = `${apiUrl}/info/files/image/${record.photo}?access_token=${token}`;
      visible.value = value;
    } else {
      imageSrc.value = '';
    }
  }

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
          confirm: () => {
            console.log('record :>> ', record);
          },
        },
      },
    ];
  }

  async function getDevicePowerSupplyPhotoList(params) {
    loading.value = true;
    try {
      const { items, totalCount } = await getDevicePowerSupplyPhotoListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function searchTableData() {
    await nextTick();
    const params = getFieldsValue();
    console.log('params :>> ', params);
    getDevicePowerSupplyPhotoList(params);
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-power-system-list';
  @form-prefix-cls: ~'@{prefix-cls}-form';

  .@{form-prefix-cls} {
    @apply pt-4;
  }
</style>

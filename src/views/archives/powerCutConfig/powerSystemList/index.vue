<template>
  <!-- 预览图片 -->
  <Image
    :width="200"
    :style="{ display: 'none' }"
    :preview="{ visible, onVisibleChange: toggleVisible }"
    :src="imageSrc"
  />

  <BasicForm :class="`${prefixCls}-form`" @register="registerForm" @submit="searchTableData" />

  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, { deviceIds: deviceIds })">新建</a-button>
    </template>

    <template #images="{ record }">
      <a-button type="primary" size="small" @click="setVisible(record)">
        {{ record.photoName }}
      </a-button>
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

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
  import {
    getDevicePowerSupplyPhotoListApi,
    deleteDevicePowerSupplyPhotoApi,
  } from '/@/api/info/devicePowerSupplyPhoto';
  import { DevicePowerSupplyPhotoExtendModel } from '/@/api/info/model/devicePowerSupplyPhotoModel';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import EditModal from './editModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { prefixCls } = useDesign('power-system-list');
  const { createMessage } = useMessage();
  const { apiUrl } = useGlobSetting();
  const { getToken: token } = useUserStore();
  const loading = ref(false);
  const visible = ref(false);
  const imageSrc = ref('');
  const deviceIds = ref<number[]>([]);
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

  function setVisible(record) {
    visible.value = true;
    imageSrc.value = `${apiUrl}/info/files/image/${record.photo}?access_token=${token}`;
  }

  function toggleVisible(value) {
    visible.value = value;
  }

  function createActions(record: DevicePowerSupplyPhotoExtendModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, { record: record, deviceIds: deviceIds.value });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            deleteDevicePowerSupplyPhotoApi(record.id)
              .then(() => {
                createMessage.success('删除成功');
                searchTableData();
              })
              .catch((error) => {
                throw new Error(error);
              });
          },
        },
      },
    ];
  }

  async function getDevicePowerSupplyPhotoList(params) {
    loading.value = true;
    try {
      const { deviceIds: ids, items, totalCount } = await getDevicePowerSupplyPhotoListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
      deviceIds.value = ids || [];
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function searchTableData() {
    await nextTick();
    const params = getFieldsValue();
    getDevicePowerSupplyPhotoList(params);
  }
</script>

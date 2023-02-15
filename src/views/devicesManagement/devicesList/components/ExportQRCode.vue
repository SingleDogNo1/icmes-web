<template>
  <BasicDrawer
    v-bind="$attrs"
    title="批量导出二维码"
    showFooter
    okText="导出"
    :okButtonProps="{ disabled: checkedPrimaryDevices.length }"
    width="750"
    @register="registerDrawer"
    @ok="handleSubmit"
  >
    <div ref="drawerInnerRef">
      <BasicForm ref="formRef" @register="registerForm" @submit="searchData" />

      <BasicTree
        ref="treeRef"
        :treeData="(treeData as any)"
        checkable
        search
        :height="treeHeight"
        defaultExpandLevel="2"
        :fieldNames="{
          title: 'titleText',
          key: 'id',
        }"
        @check="handleCheckTree"
      />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup name="ExportQRCode">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getLocationListApi } from '/@/api/info/location';
  import { GetDevicesListParam, DeviceModel } from '/@/api/info/model/devicesModel';
  import { getDevicesListApi, exportDeviceQRCodeApi } from '/@/api/info/devices';
  import { formatDeviceTypeTree } from '/@/utils/helper/treeHelper';
  import { downloadByData } from '/@/utils/file/download';

  // 除关键字、设备位置之外的，请求必须的参数
  const fixedParams: Omit<GetDevicesListParam, 'globalName' | 'locationId'> = {
    globalCondition: 'processNo,code,name',
    isTreeForDeviceCategory: true,
    category: [],
    status: [],
    hierarchy: 0,
    orderBy: 'processNo',
    ascending: true,
    parentId: -1,
    pageSize: 0,
    pageNo: 0,
  };

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const drawerInnerRef = ref<Nullable<HTMLElement>>(null);
  const formRef = ref<Nullable<HTMLElement>>(null);
  const treeData = ref<DeviceModel[]>([]);
  const checkedPrimaryDevices = ref<DeviceModel[]>([]);
  const treeHeight = ref(0);

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas: [
      {
        field: 'location',
        label: '设备位置',
        component: 'ApiTreeSelect',
        colProps: { span: 8 },
        componentProps: {
          mode: 'multiple',
          style: {
            width: '250px',
          },
          treeNodeFilterProp: 'name',
          treeCheckable: true,
          api: getLocationListApi,
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          immediate: true,
        },
      },
      {
        field: 'globalName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '设备编号/名称/唯一编码',
        },
      },
    ],
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async () => {
    await nextTick();
    // tree 组件需要指定高度才能实现虚拟滚动
    // 获取 drawer 内容容器，获取容器高度，减去其他高度，为 tree 高度
    const scrollbarWrapper = drawerInnerRef.value?.parentElement?.parentElement as HTMLElement;
    const { height: wrapperHeight } = scrollbarWrapper?.getBoundingClientRect();
    treeHeight.value = wrapperHeight - 154;
    await searchData();
  });

  async function searchData() {
    setDrawerProps({ loading: true });
    try {
      await nextTick();
      const fields: Pick<GetDevicesListParam, 'location' | 'globalName'> = getFieldsValue();
      const form = { ...fields, ...fixedParams };
      const { items } = await getDevicesListApi(form);
      treeData.value = formatDeviceTypeTree(items || []);
      await nextTick();
      treeRef.value?.filterByLevel(2);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  }

  async function handleSubmit() {
    setDrawerProps({ confirmLoading: false });
    try {
      const deviceIds = checkedPrimaryDevices.value.reduce((res, pre) => {
        res.push(pre.id);
        return res;
      }, [] as number[]);
      const data = await exportDeviceQRCodeApi({ deviceIds });
      downloadByData(data, '导出.zip');
      closeDrawer();
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function handleCheckTree(_checkedKeys, { checkedNodes }) {
    checkedPrimaryDevices.value = checkedNodes.filter((v) => v.isPrimary);
  }
</script>

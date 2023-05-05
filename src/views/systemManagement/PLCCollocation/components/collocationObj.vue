<template>
  <div class="w-full h-full bg-white px-4">
    <Tabs v-model:activeKey="activeKey" class="h-full" ref="deviceTabRef" @change="handleTabChange">
      <Tabs.TabPane key="device" tab="设备">
        <BasicTree
          ref="treeRef"
          :treeData="treeData"
          :loading="loading"
          :height="treeHeight"
          search
          placeholder="设备编号/设备名称"
          autoExpandParent
          :fieldNames="{
            title: 'titleText',
            key: 'id',
          }"
          @select="handleSelectNode"
        />
      </Tabs.TabPane>
      <Tabs.TabPane key="collocationObject" tab="配点对象">
        <BasicForm @register="register" @submit="handleGetConfigurableObjectsList" />
        <BasicTable
          :resizeHeightOffset="8"
          @register="registerTable"
          :loading="loading"
          :showQuickJumper="false"
          @row-click="handleClickRow"
        />
      </Tabs.TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'CollocationObj',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, nextTick, unref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { getDevicesListApi } from '/@/api/info/devices';
  import { getConfigurableObjectsListApi } from '/@/api/info/configurableObject';
  import { GetConfigurableObjectsListParam } from '/@/api/info/model/configurableObjectModel';
  import { formatDeviceTypeTree } from '/@/utils/helper/treeHelper';
  import { BasicForm, useForm } from '/@/components/Form';
  import { error } from '/@/utils/log';

  enum TabKeysEnum {
    device = 'device',
    collocationObject = 'collocationObject',
  }

  const emit = defineEmits(['select']);

  const activeKey = ref<TabKeysEnum>(TabKeysEnum.device);
  const loading = ref(false);
  const treeData = ref<any[]>([]);
  const deviceTabRef = ref(null);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeHeight = ref();
  const selectedRowIndex = ref<number>(-1);

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas: [
      {
        field: 'ascending',
        defaultValue: true,
        label: '升序',
        component: 'Checkbox',
        show: false,
      },
      {
        field: 'globalName',
        defaultValue: '',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '配点对象',
        },
      },
      {
        field: 'orderBy',
        defaultValue: '',
        label: '排序字段',
        component: 'Input',
        show: false,
      },
      {
        field: 'pageNo',
        label: '当前页',
        component: 'InputNumber',
        defaultValue: 1,
        show: false,
      },
      {
        field: 'pageSize',
        label: '每页条数',
        component: 'InputNumber',
        defaultValue: 10,
        show: false,
      },
    ],
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        { title: '角色编码', dataIndex: 'code', fixed: 'left' },
        { title: '角色名称', dataIndex: 'name' },
      ],
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
      },
      onChange: async () => {
        const page = getPaginationRef() as PaginationProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });

        await nextTick();

        const value = getFieldsValue() as GetConfigurableObjectsListParam;
        const params = {
          ...value,
          ...{ pageNo: page.current!, pageSize: page.pageSize! },
        };

        await getConfigurableObjectsList(params);
      },
    });

  onMounted(async () => {
    await getDevicesList();
    await nextTick();
    /*
      // TODO
      https://www.antdv.com/components/tree-cn#components-tree-demo-virtual-scroll考虑到性能，使用虚拟滚动，前提是提供 tree 组件的高度
      当前获取组件 dom 的高度进行计算得到，如何更好的获取 tree 组件的高度？？？
    */
    const deviceTabWrapper = (deviceTabRef.value as any)?.$el;
    const contentWrapper: HTMLElement = deviceTabWrapper.querySelector('.ant-tabs-content-holder');
    const contentHeaderWrapper = contentWrapper.querySelector('.icmes-tree-header') as HTMLElement;

    treeHeight.value =
      contentWrapper.getBoundingClientRect().height -
      contentHeaderWrapper.getBoundingClientRect().height;
  });

  function handleTabChange(activeKey: TabKeysEnum) {
    if (activeKey === 'device') {
      getDevicesList();
    } else if (activeKey === 'collocationObject') {
      handleGetConfigurableObjectsList();
    }
  }

  async function getDevicesList() {
    try {
      loading.value = true;
      const { items } = await getDevicesListApi({
        isTreeForDeviceCategory: true,
        pageSize: 0,
      });
      treeData.value = formatDeviceTypeTree(items || []);

      // 展开并选中第一个节点;
      const firstTreeNode = treeData.value[0].children[0].children[0];
      getTree()?.setExpandedKeys([firstTreeNode.id]);
      getTree()?.setSelectedKeys([firstTreeNode.id]);
      emit('select', { ...firstTreeNode, ...{ type: 2 } });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function getConfigurableObjectsList(params: GetConfigurableObjectsListParam) {
    try {
      loading.value = true;
      const { items, totalCount } = await getConfigurableObjectsListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 选中第一条数据
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

  function handleGetConfigurableObjectsList() {
    const value = getFieldsValue() as GetConfigurableObjectsListParam;
    getConfigurableObjectsList(value);
  }

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      error('tree is null!');
    }
    return tree;
  }

  function handleSelectNode(_key, { node }) {
    emit('select', { ...node, ...{ type: 2 } });
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
    emit('select', { ...row, ...{ type: 2 } });
  }
</script>

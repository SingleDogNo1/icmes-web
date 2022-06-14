<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="onEditChange" title="表格中嵌套表单操作">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <Row class="bg-white h-10 px-2">
      <Col :span="24" class="text-right">
        <a-button @click="handleAddRow" preIcon="ant-design:plus-outlined"> 添加输入行 </a-button>
        <a-button class="ml-3" type="primary" :loading="loading" @click="handleSave">保存</a-button>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicTable, useTable, TableAction, BasicColumn, ActionItem } from '/@/components/Table';
  import { demoListApi } from '/@/api/demo/table';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      editRow: true,
      editRule: true,
    },
    {
      title: '姓名1',
      dataIndex: 'name1',
      width: 150,
      editRow: true,
      editRule: async (text) => {
        if (text.length === 3) {
          return '姓名1不能是三个字';
        }
        return '';
      },
    },
    {
      title: '姓名2',
      dataIndex: 'name2',
      width: 150,
      editRow: true,
      editRule: true,
    },
    {
      title: '姓名3',
      dataIndex: 'name3',
      width: 150,
      editRow: true,
      editRule: true,
    },
    {
      title: '姓名4',
      dataIndex: 'name4',
      width: 150,
      editRow: true,
      editRule: true,
    },
    {
      title: '姓名5',
      dataIndex: 'name5',
      width: 150,
      editRow: true,
      editRule: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      editRow: true,
      editRule: true,
    },
  ];

  const [registerTable, { setTableData, getDataSource, updateTableDataRecord }] = useTable({
    columns,
    pagination: false,
    resizeHeightOffset: 40,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  onMounted(async () => {
    demoListApi({ page: 1, pageSize: 20 }).then(({ items }) => {
      reloadTable(items);
    });
  });

  function createActions(record): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，请问确认删除数据？',
          confirm: () => {
            const data = getDataSource();
            const index = data.findIndex((v) => v.key === record.key);
            data.splice(index, 1);
            reloadTable(data);
          },
        },
      },
    ];
  }

  function onEditChange({ column, value, record }) {
    record.editValueRefs[column.dataIndex].value = value;
  }

  async function handleAddRow() {
    const data = getDataSource();
    data.push({
      name: null,
      name1: null,
      name2: null,
      name3: null,
      name4: null,
      name5: null,
      address: null,
    });

    reloadTable(data);
  }

  // 表格数据变动，重新渲染表格并设置为编辑模式
  async function reloadTable(data) {
    setTableData(data);
    await nextTick();
    getDataSource().map((v) => {
      v.onEdit(true);
    });
  }

  async function handleSave() {
    const validRows = getDataSource().reduce((res, pre) => {
      res.push(valid(pre));
      return res;
    }, [] as Promise<any>[]) as Promise<any>[];

    Promise.all(validRows).then((data: boolean[]) => {
      const valid = data.reduce((res, pre) => {
        res = res && pre;
        return res;
      }, true);

      // mock 提交数据
      if (valid) {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          createMessage.success('保存成功, 打开控制台查看提交结果');
          console.log('res :>> ', getDataSource());
        }, 2000);
      }
    });
  }

  async function valid(record) {
    const valid = await record.onValid?.();
    if (valid) {
      const data = cloneDeep(record.editValueRefs);
      updateTableDataRecord(record.key, data);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => resolve(false));
    }
  }
</script>

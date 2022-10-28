<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="onEditChange">
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
      helpMessage: '添加测试规则，不可以为三个字',
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
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: 'Option1',
            value: '1',
          },
          {
            label: 'Option2',
            value: '2',
          },
          {
            label: 'Option3',
            value: '3',
          },
        ],
      },
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
    title: '表格中嵌套表单操作',
    titleHelpMessage: [
      '新增一行数据时必须添加数据中的标识唯一值字段（示例中为 id）以保证数据唯一性',
      '控制行数据变化的方法也是通过唯一标识字段（示例中为 id）来修改的',
    ],
    columns,
    resizeHeightOffset: 40,
    pagination: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  onMounted(async () => {
    demoListApi({ page: 1, pageSize: 10 }).then(({ items }) => {
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
            const index = data.findIndex((v) => v.id === record.id);
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
      id: new Date().getTime(), // 新增的数据, 添加时间戳作为唯一值，在操作行数据时使用
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
          const data = getDataSource().reduce((res, pre) => {
            res.push(cloneDeep(pre.editValueRefs));
            return res;
          }, [] as Recordable<any>[]);

          console.log('data :>> ', data);
        }, 2000);
      }
    });
  }

  async function valid(record) {
    const valid = await record.onValid?.();
    if (valid) {
      const data = cloneDeep(record.editValueRefs);
      updateTableDataRecord(record.id, data);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => resolve(false));
    }
  }
</script>

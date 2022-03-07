<template>
  <PageWrapper contentFullHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable
        title="策略规则配置"
        :titleHelpMessage="[
          '一个策略可以有多个规则，多个规则之间为并集关系',
          '',
          '一个规则可以有多个判断公式，多个判断公式之间为交集关系',
          '',
          '点击“+”可增加判断公式',
        ]"
        :resizeHeightOffset="40"
        :loading="loading"
        @register="registerTable"
      >
        <template #toolbar>
          <a-button type="primary" @click="addNewRule"> 添加输入行 </a-button>
        </template>
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
        <template #rules="{ record }">
          <Row
            v-for="(item, i) in record"
            :key="i"
            :gutter="16"
            type="flex"
            align="middle"
            justify="center"
          >
            <Col :span="8">
              <Form.Item>
                <Select v-model:value="item.operator">
                  <Select.Option
                    v-for="option in strategySymbolOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item
                :validateStatus="getValidateStatus(item).status"
                :help="getValidateStatus(item).message"
              >
                <Input
                  v-if="['EQUAL', 'NOT_EQUAL'].includes(item.operator)"
                  v-model:value="item.data"
                  oninput="value=value.replace(/[^\d\,]/g,'')"
                />
                <Input
                  v-else
                  v-model:value="item.data"
                  oninput="value=value.replace(/[^\d]/g,'')"
                />
              </Form.Item>
            </Col>
            <Col :span="3">
              <Icon
                v-if="i === record.length - 1"
                icon="fluent:add-circle-20-regular"
                :size="24"
                :color="primaryColor"
                class="cursor-pointer"
                @click="addRecordRule(record)"
              />
              <Icon
                v-else
                icon="system-uicons:minus-circle"
                :size="24"
                :color="errorColor"
                class="cursor-pointer"
                @click="delRecordRule(record, i)"
              />
            </Col>
          </Row>
        </template>
      </BasicTable>

      <a-button block type="primary" style="height: 40px" @click="save">保存</a-button>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, watch, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { Select, Input, Form, Row, Col } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { strategySymbolOptions } from '../data';
  import { errorColor, primaryColor } from '/@/settings/designSetting';
  import { StrategyModel, StrategyRuleModel } from '/@/api/info/model/strategyModel';
  import { getStrategyRuleByIdApi, updateStrategyRulesApi } from '/@/api/info/strategy';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const props = defineProps({
    selectedRow: {
      type: Object as PropType<StrategyModel>,
      required: true,
    },
  });

  const loading = ref(false);
  const { selectedRow } = toRefs(props);

  const [registerTable, { getDataSource, setTableData }] = useTable({
    columns: [
      {
        title: '规则配置',
        dataIndex: 'rules',
        slots: { customRender: 'rules' },
      },
    ],
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      slots: { customRender: 'action' },
    },
    pagination: false,
  });

  function getValidateStatus(row): { status: 'success' | 'error'; message: string } {
    return {
      status: row.data.trim() ? 'success' : 'error',
      message: row.data.trim() ? '' : '规则数据不能为空',
    };
  }

  function addNewRule() {
    const data = getDataSource();
    const addRow: EditRecordRow = [{ operator: 'GREATER_THAN', data: '', key: `${Date.now()}` }];
    data.unshift(addRow);
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        onClick: () => {
          const data = getDataSource();
          const index = data.findIndex((v) => v.key === record.key);
          data.splice(index, 1);
        },
      },
    ];
  }

  async function save() {
    const data = getDataSource();

    // 没有现成的校验方法,自己实现
    const res = data.reduce((res, pre) => {
      pre.map((v) => {
        res.push(v);
      });
      return res;
    }, [] as any[]);

    const valid = res.reduce((res, pre) => {
      res = res && pre.data.trim() !== '';
      return res;
    }, true);

    if (!valid) {
      throw new Error('validate error!');
    }

    const params = {
      strategyId: selectedRow.value.id,
      models: data as unknown as StrategyRuleModel[],
    };

    try {
      loading.value = true;
      await updateStrategyRulesApi(params);
      createMessage.success('策略保存成功');
      getStrategyRuleById(selectedRow.value);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function addRecordRule(record) {
    record.push({ operator: 'GREATER_THAN', data: '' });
  }

  function delRecordRule(record, index) {
    record.splice(index, 1);
  }

  async function getStrategyRuleById(record: StrategyModel) {
    try {
      loading.value = true;
      const data = await getStrategyRuleByIdApi(record.id);

      setTableData(data);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => props.selectedRow,
    (val) => {
      getStrategyRuleById(val);
    },
    {
      deep: true,
    },
  );
</script>

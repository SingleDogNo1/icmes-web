<!-- TODO: select 框选中的值没有删除按钮，但是绑定值替换为 value2正常。why？？ -->
<template>
  <template v-for="(item, index) in tableData" :key="index">
    <Row :gutter="16">
      <Col flex="1">
        <AForm.Item
          label="检修类型"
          :name="['items', index, 'maintenanceType']"
          :rules="{ required: true, message: '请选择检修类型' }"
        >
          <Select
            v-model:value="item.maintenanceType"
            :options="genMaintTypeOptions"
            mode="multiple"
            optionFilterProp="label"
            @change="genMaintenanceOptions(data)"
            allow-clear
          />
        </AForm.Item>
      </Col>
      <Col flex="1">
        <AForm.Item
          label="停送电类型"
          :name="['items', index, 'powerType']"
          :rules="{ required: true, message: '请选择停送电类型' }"
        >
          <Select
            :options="powerTypeOptions"
            v-model:value="item.powerType"
            optionFilterProp="label"
            @change="genPowerTypeOptions(data)"
            allowClear
          />
        </AForm.Item>
      </Col>
      <Col flex="65px">
        <a-button type="danger" @click="del(data, index)">删除</a-button>
      </Col>
    </Row>
  </template>
</template>

<script lang="ts">
  export default {
    name: 'MaintenanceSettingTable',
  };
</script>

<script lang="ts" setup>
  import { ref, toRef } from 'vue';
  import type { PropType, Ref } from 'vue';
  import { Select, Form as AForm, Row, Col } from 'ant-design-vue';
  import { MaintenanceOrderConfigurationModel } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { useUserState } from '/@/hooks/web/useUserState';

  const { getDictOptions } = useUserState();

  const props = defineProps({
    data: {
      type: Array as PropType<MaintenanceOrderConfigurationModel['items']>,
      required: true,
    },
  });

  const tableData = toRef(props, 'data');

  // const value2 = ref(['a1', 'a2']);

  const maintTypeOptions = getDictOptions('DT_MAINT_TYPE');
  const genMaintTypeOptions = ref(maintTypeOptions) as unknown as Ref<
    {
      label: string;
      value: string;
      disabled: boolean;
    }[]
  >;
  const powerTypeOptions = ref<{ label: string; value: string; disabled: boolean }[]>([]);

  function genMaintenanceOptions(arr: any[]) {
    const selectedOptions = arr.reduce((res, pre) => {
      res = [...res, ...pre.maintenanceType];
      return res;
    }, []);
    genMaintTypeOptions.value.map((val) => {
      val.disabled = selectedOptions.includes(val.value);
    });
  }

  function genPowerTypeOptions(arr: any[]) {
    const selectedOptions = arr.reduce((res, pre) => {
      res.push(pre.powerType);
      return res;
    }, []);
    powerTypeOptions.value.map((val) => {
      val.disabled = selectedOptions.includes(val.value);
    });
  }

  function setPowerTypeOptions(val) {
    powerTypeOptions.value = val;
  }

  function del(arr, index) {
    arr.splice(index, 1);
    genMaintenanceOptions(arr);
    genPowerTypeOptions(arr);
  }

  defineExpose({
    genMaintenanceOptions,
    setPowerTypeOptions,
    genPowerTypeOptions,
  });
</script>

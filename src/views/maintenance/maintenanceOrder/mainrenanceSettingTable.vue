<template>
  <template v-for="(item, index) in data" :key="index">
    <Row :gutter="12">
      <Col flex="1">
        <AForm.Item label="检修类型">
          <ASelect
            v-model:value="item.maintenanceType"
            mode="multiple"
            :options="genMaintTypeOptions"
            @change="genMaintenanceOptions(data)"
            allow-clear
          />
        </AForm.Item>
      </Col>
      <Col flex="1">
        <AForm.Item label="停送电类型">
          <ASelect
            :options="powerTypeOptions"
            v-model:value="item.powerType"
            @change="genPowerTypeOptions(data)"
            allowClear
          />
        </AForm.Item>
      </Col>
      <Col flex="65px">
        <a-button @click="del(data, index)">删除</a-button>
      </Col>
    </Row>
  </template>
</template>

<script lang="ts">
  export default {
    name: 'MainrenanceSettingTable',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { PropType, Ref } from 'vue';
  import { Select as ASelect, Form as AForm, Row, Col } from 'ant-design-vue';
  import { MaintenanceOrderConfigurationModel } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { useUserState } from '/@/hooks/web/useUserState';

  defineProps({
    data: {
      type: Array as PropType<MaintenanceOrderConfigurationModel['items']>,
      required: true,
    },
  });

  const { getDictOptions } = useUserState();

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

<template>
  <Card title="当班实时产量" :loading="loading">
    <template #extra>
      <DoubleRightOutlined class="cursor-pointer text-sm" @click="toProductionData" />
    </template>

    <div>
      <span> 入厂原煤（吨）</span>
      <span class="count">{{ rawCoalCount }}</span>
    </div>
  </Card>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref } from 'vue';
  import { DoubleRightOutlined } from '@ant-design/icons-vue';
  import { Card } from 'ant-design-vue';
  import { getDashboardRealTimeApi } from '/@/api/production/basic';
  import { addTaskListener } from '/@/utils/timingTask';

  const loading = ref(true);
  const date = ref('');
  const shiftName = ref('');
  const rawCoalCount = ref('');
  const outputList: Ref<{ name: string; value: string }[]> = ref([]);

  getDashboardRealTimeApi()
    .then((data) => {
      if (data) {
        loading.value = false;
        date.value = data.date;
        shiftName.value = data.shiftName;
        rawCoalCount.value = data['入洗原煤(吨)'];

        for (const name in data) {
          if (['块煤(吨)', '煤泥(吨)', '末煤(吨)', '籽煤(吨)'].includes(name)) {
            const value = data[name];
            outputList.value.push({
              name,
              value,
            });
          }
        }
      }
    })
    .catch(() => {
      loading.value = false;
    });
  addTaskListener('*/1 * * * * ?', () => {
    console.log('111 :>> ', 111);
  });

  function toProductionData() {
    console.log('跳转到生产运行数据统计 :>> ');
  }
</script>

<style scoped></style>

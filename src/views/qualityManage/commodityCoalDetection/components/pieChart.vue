<template>
  <Spin :spinning="loading">
    <div ref="chartRef" :style="{ height: '400px', width: '100%' }"></div>
  </Spin>
</template>

<script lang="ts">
  export default {
    name: 'PieChartComp',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref, watch, PropType } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  type ChartData = {
    batchQualifiedRate: number;
    batchStableRate: number;
  };

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.data,
    (data) => {
      console.log('data :>> ', data);
      const { batchQualifiedRate: qualified, batchStableRate: stable } = data;

      const qualifiedRate = parseFloat((qualified * 100).toFixed(1));
      const stableRate = parseFloat((stable * 100).toFixed(1));

      setOptions({
        backgroundColor: '#fff',
        title: [
          {
            subtext: '批合格率',
            left: '25%',
            top: '85%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: 14,
            },
          },
          {
            subtext: '批稳定率',
            left: '75%',
            top: '85%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: 14,
            },
          },
        ],
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
        series: [
          {
            name: '批合格率',
            type: 'pie',
            radius: [20, 100],
            center: ['25%', '50%'],
            data: [
              { value: qualifiedRate, name: '合格' },
              { value: 100 - qualifiedRate, name: '不合格' },
            ],
          },
          {
            name: '批稳定率',
            type: 'pie',
            radius: [20, 100],
            center: ['75%', '50%'],
            data: [
              { value: stableRate, name: '稳定' },
              { value: 100 - stableRate, name: '不稳定' },
            ],
          },
        ],
      });
    },
  );
</script>

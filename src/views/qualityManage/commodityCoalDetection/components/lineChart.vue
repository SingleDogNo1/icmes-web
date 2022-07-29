<template>
  <Spin :spinning="loading">
    <div :style="{ height: '400px', width: '100%' }" class="relative">
      <ASelect
        class="!absolute top-4 left-4 z-4 w-220px"
        v-model:value="chartType"
        :options="chartTypeOptions"
        @change="handleChangeChartType"
      />

      <div v-if="data.length" ref="chartRef" :style="{ height: '100%', width: '100%' }"></div>
      <div v-else class="w-full h-full bg-white flex flex-col justify-center">
        <Empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </div>
    </div>
  </Spin>
</template>

<script lang="ts">
  export default {
    name: 'LineChartComp',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { Select as ASelect, Empty, Spin } from 'ant-design-vue';
  import { genBarSeriesData, gen_line_series_data } from '../helper';
  import { useECharts } from '/@/hooks/web/useECharts';
  import type { EChartsOption } from 'echarts';
  import { CommercialCoalInspectionModel } from '/@/api/quality/model/commercialCoalInspectionModel';
  import { dateUtil } from '/@/utils/dateUtil';
  import { basicEchartsOptions } from '../data';
  import { chain, cloneDeep } from 'lodash-es';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as PropType<CommercialCoalInspectionModel[]>,
      required: true,
    },
  });

  const chartType = ref('all');
  const chartTypeOptions = [
    { value: 'all', label: '检测数据-分产品算术平均' },
    { value: 'mt', label: '全水分Mt(%)-趋势' },
    { value: 'ad', label: '灰分Ad(%)-趋势' },
    { value: 'vdaf', label: '挥发分Vdaf(%)-趋势' },
    { value: 'std', label: '全硫St,d(%)-趋势' },
    { value: 'qnetArCal', label: 'Qnet,ar(Cal/g)-趋势' },
    { value: 'tonnage', label: '发运量-趋势' },
  ];
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const chartData = ref<CommercialCoalInspectionModel[]>([]);

  function handleChangeChartType(type) {
    switch (type) {
      case 'all':
        renderAverageDataBarChart(chartData.value);
        break;
      default:
        renderLineChart(chartData.value, type);
    }
  }

  // 渲染分产品算术平均柱状图
  function renderAverageDataBarChart(data: CommercialCoalInspectionModel[]) {
    // 生成柱状图的 x 轴数据 eg: ['混煤', '兖矿鲁炼焦二号精煤', '煤泥']
    const barChartXAxis = data.reduce((res, pre) => {
      if (!res.includes(pre.loadingPlanBaseModel.productionVariety as string)) {
        res.push(pre.loadingPlanBaseModel.productionVariety as string);
      }
      return res;
    }, [] as string[]);

    const barOptions = {
      ...basicEchartsOptions,
      ...{
        xAxis: [
          {
            type: 'category',
            data: barChartXAxis,
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
      },
      ...{
        legend: {
          right: '16px',
          top: '16px',
          data: ['全水分Mt(%)', '灰分Ad(%)', '挥发分Vdaf(%)', '全硫St,d(%)'],
        },
      },
      ...{
        series: genBarSeriesData(barChartXAxis, data, {
          mt: '全水分Mt(%)',
          ad: '灰分Ad(%)',
          vdaf: '挥发分Vdaf(%)',
          std: '全硫St,d(%)',
        }),
      },
    };

    setOptions(barOptions as EChartsOption);
  }

  function renderLineChart(data: CommercialCoalInspectionModel[], type: string) {
    // 生成折线图的图例数据 eg: ['混煤', '兖矿鲁炼焦二号精煤', '煤泥']
    const lineLegendData = data.reduce((res, pre) => {
      if (!res.includes(pre.loadingPlanBaseModel.productionVariety)) {
        res.push(pre.loadingPlanBaseModel.productionVariety);
      }
      return res;
    }, [] as string[]);

    // 获取所有数据中的检测日期字段，去重，并升序排序
    const unique_date = chain(data)
      .reduce((res, pre) => {
        res.push(pre.inspectionDate);
        return res;
      }, [] as number[])
      .uniq()
      .sortBy((v) => v)
      .value();

    // 将检测日期转换为日期字符串，作为 x 轴
    const lineChartXAxis = unique_date.reduce((res, pre) => {
      res.push(dateUtil(pre).format('YYYY-MM-DD'));
      return res;
    }, [] as string[]);

    const lineOptions = {
      ...basicEchartsOptions,
      ...{
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: lineChartXAxis,
          },
        ],
      },
      ...{
        legend: {
          right: '16px',
          top: '16px',
          data: lineLegendData,
        },
      },
      ...{
        series: gen_line_series_data(data, unique_date, lineLegendData, type),
      },
    };

    setOptions(lineOptions as EChartsOption);
  }

  watch(
    () => props.data,
    (value) => {
      const data: (CommercialCoalInspectionModel & { tonnage?: number })[] = cloneDeep(value);
      data.map((item) => {
        item.tonnage = item.loadingPlanBaseModel.tonnage;
      });

      chartData.value = data;

      switch (chartType.value) {
        case 'all':
          renderAverageDataBarChart(chartData.value);
          break;
        default:
          renderLineChart(chartData.value, chartType.value);
      }
    },
  );
</script>

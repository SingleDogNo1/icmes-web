import { chain } from 'lodash-es';
import { CommercialCoalInspectionModel } from '/@/api/quality/model/commercialCoalInspectionModel';

/**
 * 计算给定数组中指定 key 的非空值总和的平均数
 * @param {Array} arr 需要处理的数组
 * @param {string} key 需要计算的 key
 * @param {number} precision 结果的精度(保留几位小数)
 */
function average(arr: Record<string, number>[], key: string, precision = 2) {
  let sum = 0,
    count = 0;
  arr.forEach((item) => {
    if (item[key]) {
      sum += item[key];
      count++;
    }
  });

  return sum ? parseFloat((sum / count).toFixed(precision)) : 0;
}

/**
 * 给定的数组处理为 echarts 柱状图类似 series 的数据格式(还需要二次加工成为 echarts 的 series 的数据格式)
 * @param {Array} arr 需要处理的数组
 * @param key echarts xAxis.data X 轴对应的数据
 * @param legend echarts legend 图例数据
 * @example
 * genSeriesData(chartData, '兖矿鲁炼焦二号精煤', [{ key: 'mt', label: '全水分Mt(%)' }, { key: 'ad', label: '灰分Ad(%)' }, { key: 'vdaf', label: '挥发分Vdaf(%)' }, { key: 'std', label: '全硫St,d(%)' }]) ==>
  [
    { name: '全水分Mt(%)', type: 'bar', data: [ '8.65' ] },
    { name: '灰分Ad(%)', type: 'bar', data: [ '9.53' ] },
    { name: '挥发分Vdaf(%)', type: 'bar', data: [ '36.68' ] },
    { name: '全硫St,d(%)', type: 'bar', data: [ '0.50' ] }
  ]
 */
function gen_bar_series_data(
  arr: CommercialCoalInspectionModel[],
  key: string,
  legend: Record<string, string>,
) {
  const matchData = arr.filter((item) => item.loadingPlanBaseModel.productionVariety === key);

  const res: { name: string; type: string; data: number[] }[] = [];

  Object.keys(legend).forEach((key) => {
    const name = legend[key];
    res.push({
      name,
      type: 'bar',
      data: [average(matchData as unknown as Record<string, number>[], key)],
    });
  });
  return res;
}

/**
 * 返回 echarts 数据经过处理生成的 series 数据，值为每组对应数据的平均值
 * @param xAxis xAxis.data X 轴对应的数据
 * @param data echarts 数据
 * @param legend echarts 图例数据
 */
export function genBarSeriesData(
  xAxis: string[],
  data: CommercialCoalInspectionModel[],
  legend: Record<string, string>,
) {
  let arr: { name: string; type: string; data: number[] }[] = [];
  xAxis.map((item) => {
    arr = [...arr, ...gen_bar_series_data(data, item, legend)];
  });

  const res = chain(arr)
    .groupBy('name')
    .map((value, key) => {
      return {
        name: key,
        type: 'bar',
        data: value.reduce((res, pre) => {
          res = [...res, ...pre.data];
          return res;
        }, [] as number[]),
      };
    })
    .value();

  return res;
}

/**
 * 返回 echarts 数据经过处理生成的 series 数据，值为每组对应数据的平均值
 * @param data echarts 数据
 * @param xAxis xAxis.data X 轴对应的数据
 * @param legend echarts 图例数据
 * @param type 选中要查看的折线图的类型
 */
function gen_line_series_item(
  data: CommercialCoalInspectionModel[],
  xAxis: number[],
  legend: string,
  type: string,
) {
  // 获取已有的日期数据，并且如果有多个当天的数据，对所有数据进行平均并重新赋值
  const dataArr_exist = chain(data)
    .filter((item) => item.loadingPlanBaseModel.productionVariety === legend) // 过滤数据中对应当前图例的数据
    .sortBy('inspectionDate') // 按照日期升序排序
    // 重组数据，只保留日期和当前下拉选中的选项
    // 当前数据中会有一个日期对应多组数据的情况，因此还需要求特殊数据的平均值
    .reduce((res, pre) => {
      const json: Record<string, number> = {};
      json.inspectionDate = pre.inspectionDate;
      json[type] = pre[type];
      res.push(json);
      return res;
    }, [] as Record<string, number>[])
    .groupBy('inspectionDate')
    // 按照分组，如果只有一条数据，直接赋值，如果有多条数据，求平均值后赋值
    .reduce((res, pre) => {
      if (pre.length === 1) {
        const json: Record<string, number> = {};
        json.inspectionDate = pre[0].inspectionDate;
        json[type] = pre[0][type];
        res.push(json);
      } else {
        const json: Record<string, number> = {};
        json.inspectionDate = pre[0].inspectionDate;
        json[type] = average(pre, type, 1);
        res.push(json);
      }
      return res;
    }, [] as Record<string, number>[])
    .value();

  // 获取已有数据的日期
  const dateArr_exist = dataArr_exist.reduce((res, pre) => {
    res.push(pre.inspectionDate);
    return res;
  }, [] as number[]);

  // 创建没有数据的日期数组，值绑定为 0
  const dataArr_none: Record<string, number>[] = [];
  xAxis.map((item) => {
    if (!dateArr_exist.includes(item)) {
      const json: Record<string, number> = {};
      json.inspectionDate = item;
      json[type] = 0;
      dataArr_none.push(json);
    }
  });

  // 合并没有数据的数据和已有数据的数据并排序
  const item_series_data_all = [...dataArr_exist, ...dataArr_none]
    .sort((a, b) => a.inspectionDate - b.inspectionDate)
    .reduce((res, pre) => {
      res.push(pre[type]);
      return res;
    }, [] as number[]);

  const res = {
    name: legend,
    type: 'line',
    emphasis: { focus: 'series' },
    data: item_series_data_all,
  };
  return res;
}

// 集合单个series， 组合为完整的 series 实例
export function gen_line_series_data(data, xAxis, legends, type) {
  return legends.reduce((res, pre) => {
    res.push(gen_line_series_item(data, xAxis, pre, type));
    return res;
  }, [] as any);
}

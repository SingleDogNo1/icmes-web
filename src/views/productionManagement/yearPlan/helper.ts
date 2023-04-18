import { ProductionYearPlanProductionAdvanceModel } from '/@/api/production/model/yearPlanModel';
import { omit, cloneDeep } from 'lodash-es';
import { parseFloatNumber } from '/@/utils';

export function parseYearPlanTableData(
  list: (ProductionYearPlanProductionAdvanceModel & { title?: string })[],
) {
  const rawCoal = list.filter((v) => v.productType === 0);
  const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);

  // 创建一条数据，表示所有原煤数据各自相加的合计
  const totalRawCoal = rawCoal.reduce(
    (res, pre) => {
      res.productAmount += pre.productAmount || 0;
      res.productivity += pre.productivity || 0;
      res.ash += pre.ash || 0;
      res.moisture += pre.moisture || 0;
      res.mj += pre.mj || 0;
      return res;
    },
    {
      productVarieties: '原煤合计',
      productType: 0,
      productAmount: 0,
      productivity: 0,
      ash: 0,
      moisture: 0,
      mj: 0,
    } as unknown as ProductionYearPlanProductionAdvanceModel,
  );

  // 根据合计原煤，重新计算各个产出每种的产率（当前煤种产出量 / 原煤合计总入洗量）
  list.map((v) => {
    if (v.productType !== 0) {
      v.productivity = parseFloatNumber(v.productAmount / totalRawCoal.productAmount, 4);
    }
  });

  // 在当前列表数据，最后一条入洗煤种之后，插入入洗煤种合计
  list.splice(rawCoalIndex + 1, 0, totalRawCoal);

  const cleanedCoal = list.filter(
    (v) => v.productType === 1 && v.productionGroup === 'PROD_FG_001',
  );
  const cleanedCoalIndex = list.findLastIndex(
    (v) => v.productType === 1 && v.productionGroup === 'PROD_FG_001',
  );

  // 创建一条数据，表示所有精煤数据各自相加的合计
  const totalCleanedCoal = cleanedCoal.reduce(
    (res, pre) => {
      res.productAmount += pre.productAmount || 0;
      res.productivity += pre.productivity || 0;
      res.ash += pre.ash || 0;
      res.moisture += pre.moisture || 0;
      res.mj += pre.mj || 0;
      return res;
    },
    {
      productVarieties: '精煤合计',
      productType: 1,
      productAmount: 0,
      productivity: 0,
      ash: 0,
      moisture: 0,
      mj: 0,
    } as unknown as ProductionYearPlanProductionAdvanceModel,
  );

  // 在当前列表数据，最后一条精煤之后，插入精煤合计
  list.splice(cleanedCoalIndex + 1, 0, totalCleanedCoal);

  // 创建一条数据，表示所有产出煤种数据合计
  const outputCoal = list.filter((v) => v.productType !== 0 && v.productionGroup);

  const totalOutputCoal = outputCoal.reduce(
    (res, pre) => {
      res.productAmount += pre.productAmount || 0;
      res.productivity += pre.productivity || 0;
      res.ash += pre.ash || 0;
      res.moisture += pre.moisture || 0;
      res.mj += pre.mj || 0;
      return res;
    },
    {
      productVarieties: '产出总量',
      productType: 1,
      productAmount: 0,
      productivity: 0,
      ash: 0,
      moisture: 0,
      mj: 0,
    } as unknown as ProductionYearPlanProductionAdvanceModel,
  );

  // 列表最后插入产出总量的合计
  list.push(totalOutputCoal);
  // 根据产品类型，加入自定义标题
  list.forEach((item) => {
    if (item.productType === 0) {
      item.title = '计划入洗量';
    } else {
      item.title = '计划产出量';
    }
  });

  return list;
}

export function basicTableCellStyle(index, list) {
  // 获取列表中最后一条原煤数据所在的索引
  const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
  // 从第一条原煤开始，合并${原煤数据条数}行数据
  if (index < rawCoalIndex) {
    return { style: { background: '#f7fcf2' } };
  }

  if (index === rawCoalIndex) {
    return { style: { color: '#ff6702', background: '#f7fcf2' } };
  }

  // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
  if (index > rawCoalIndex && index < list.length - 1) {
    return { style: { background: '#f2f7ff' } };
  }

  if (index === list.length - 1) {
    return { style: { color: '#ff6702', background: '#f2f7ff' } };
  }
}

export function setMonthPlanTableData(list, monthWorkDays) {
  const monthPlanList = cloneDeep(list || []);
  const rawCoal = monthPlanList.filter((v) => v.productType === 0);
  const rawCoalIndex = monthPlanList.findLastIndex((v) => v.productType === 0);

  // 创建一条数据，表示所有原煤数据各自相加的合计
  const totalRawCoal = rawCoal.reduce(
    (res, pre) => {
      res.month1 += parseFloat(pre.month1) || 0;
      res.month2 += parseFloat(pre.month2) || 0;
      res.month3 += parseFloat(pre.month3) || 0;
      res.month4 += parseFloat(pre.month4) || 0;
      res.month5 += parseFloat(pre.month5) || 0;
      res.month6 += parseFloat(pre.month6) || 0;
      res.month7 += parseFloat(pre.month7) || 0;
      res.month8 += parseFloat(pre.month8) || 0;
      res.month9 += parseFloat(pre.month9) || 0;
      res.month10 += parseFloat(pre.month10) || 0;
      res.month11 += parseFloat(pre.month11) || 0;
      res.month12 += parseFloat(pre.month12) || 0;

      return res;
    },
    {
      productType: 0,
      productVarieties: '原煤合计',
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
    },
  );

  // 在当前列表数据，最后一条入洗煤种之后，插入入洗煤种合计
  monthPlanList.splice(rawCoalIndex + 1, 0, totalRawCoal);

  const averageRawCoalData = Object.keys(
    omit(totalRawCoal, ['productType', 'productVarieties']),
  ).map((key, i) => ({
    average: parseFloatNumber(totalRawCoal[key] / monthWorkDays[i].workDayTotal),
  }));

  // 创建一条数据，表示原煤平均每日入洗量
  const averageRawCoal = averageRawCoalData.reduce(
    (res, pre, i) => {
      res['month' + (i + 1)] = pre.average;
      return res;
    },
    {
      productType: 0,
      productVarieties: '平均每日入洗量',
      rowType: 'average',
    } as Record<string, string | number>,
  );

  // 在当前列表数据，原煤合计之后，插入平均每日入洗量
  monthPlanList.splice(rawCoalIndex + 2, 0, averageRawCoal);

  const cleanedCoal = monthPlanList.filter(
    (v) => v.productType === 1 && v.productionGroup === 'PROD_FG_001',
  );
  const cleanedCoalIndex = monthPlanList.findLastIndex(
    (v) => v.productType === 1 && v.productionGroup === 'PROD_FG_001',
  );

  // 创建一条数据，表示所有精煤数据各自相加的合计
  const totalCleanedCoal = cleanedCoal.reduce(
    (res, pre) => {
      res.month1 += parseFloat(pre.month1) || 0;
      res.month2 += parseFloat(pre.month2) || 0;
      res.month3 += parseFloat(pre.month3) || 0;
      res.month4 += parseFloat(pre.month4) || 0;
      res.month5 += parseFloat(pre.month5) || 0;
      res.month6 += parseFloat(pre.month6) || 0;
      res.month7 += parseFloat(pre.month7) || 0;
      res.month8 += parseFloat(pre.month8) || 0;
      res.month9 += parseFloat(pre.month9) || 0;
      res.month10 += parseFloat(pre.month10) || 0;
      res.month11 += parseFloat(pre.month11) || 0;
      res.month12 += parseFloat(pre.month12) || 0;
      return res;
    },
    {
      productVarieties: '精煤合计',
      productType: 1,
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
    },
  );

  // 在当前列表数据，最后一条精煤之后，插入精煤合计
  monthPlanList.splice(cleanedCoalIndex + 1, 0, totalCleanedCoal);

  // 创建一条数据，表示所有产出煤种数据合计
  const outputCoal = monthPlanList.filter((v) => v.productType !== 0 && v.productionGroup);

  const totalOutputCoal = outputCoal.reduce(
    (res, pre) => {
      res.month1 += parseFloat(pre.month1) || 0;
      res.month2 += parseFloat(pre.month2) || 0;
      res.month3 += parseFloat(pre.month3) || 0;
      res.month4 += parseFloat(pre.month4) || 0;
      res.month5 += parseFloat(pre.month5) || 0;
      res.month6 += parseFloat(pre.month6) || 0;
      res.month7 += parseFloat(pre.month7) || 0;
      res.month8 += parseFloat(pre.month8) || 0;
      res.month9 += parseFloat(pre.month9) || 0;
      res.month10 += parseFloat(pre.month10) || 0;
      res.month11 += parseFloat(pre.month11) || 0;
      res.month12 += parseFloat(pre.month12) || 0;
      return res;
    },
    {
      productVarieties: '产出总量',
      productType: 1,
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
    },
  );

  // 列表最后插入产出总量的合计
  monthPlanList.push(totalOutputCoal);
  // 根据产品类型，加入自定义标题
  monthPlanList.forEach((item) => {
    if (item.productType === 0) {
      item.title = '计划入洗量';
    } else {
      item.title = '计划产出量';
    }

    const totalCount = Object.keys(item).reduce(
      (res, pre) => {
        const value = item[pre];
        if (/month\d+$/i.test(pre)) {
          res.number += parseFloat(value);
          res.length++;
        }
        return res;
      },
      { number: 0, length: 0 },
    );

    if (item.rowType && item.rowType === 'average') {
      item.total = parseFloatNumber(totalCount.number / totalCount.length);
    } else {
      item.total = parseFloatNumber(totalCount.number);
    }
  });

  console.log('monthPlanList :>> ', monthPlanList);
  return monthPlanList;
}

export function parseMonthPlanTableData(list, monthWorkDays) {
  const monthPlanList = (list || []).reduce((res, pre) => {
    res.push({
      productType: pre.productType,
      productionGroup: pre.productionGroup,
      productVarieties: pre.productVarieties,
      ...pre.monthAmounts.reduce((RES, PRE) => {
        RES['month' + PRE.month] = PRE.amount;
        return RES;
      }, {} as Recordable<any>),
    });
    return res;
  }, [] as any[]);

  const tableData = setMonthPlanTableData(monthPlanList, monthWorkDays);

  return tableData;
}

export function parseStep2FormTable(list, monthWorkDays) {
  const monthPlanList = cloneDeep(list || []).filter(
    (v) => !v.productVarieties.match(/(总量|合计|平均)/g),
  );

  const tableData = setMonthPlanTableData(monthPlanList, monthWorkDays);

  return tableData;
}

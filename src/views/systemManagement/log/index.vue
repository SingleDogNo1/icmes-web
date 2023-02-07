<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicForm @register="register" @submit="getLogList" />
    <BasicTable @register="registerTable" :loading="loading">
      <template #module="{ record }"> {{ moduleMap[record.module] }} </template>
      <template #operate="{ record }"> {{ operateMap[record.operate] }} </template>
      <template #content="{ record }"> {{ genLogContentText(record.content) }} </template>
      <template #time="{ record }"> {{ formatDate(record.time, 'YYYY-MM-DD HH:mm') }} </template>
      <template #terminalType="{ record }"> {{ terminalTypeMap[record.terminalType] }} </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="SystemManagementLog">
  import { nextTick, ref } from 'vue';
  import { trimEnd } from 'lodash-es';
  import { formatDate } from '/@/utils/dateUtil';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { getLogListApi } from '/@/api/info/log';
  import { GetLogListParam } from '/@/api/info/model/logModel';
  import { schemas, columns } from './data';

  const { getDictMap } = useUserState();

  const loading = ref(false);
  const moduleMap = getDictMap('DT_FUNCTION');
  const operateMap = getDictMap('DT_ACTION');
  const terminalTypeMap = getDictMap('DT_TERMINAL_TYPE');

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    labelWidth: 150,
    schemas,
    fieldMapToTime: [['timeRange', ['timeStart', 'timeEnd'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setFieldsValue({
        pageNo: page.current,
        pageSize: page.pageSize,
      });
      nextTick(() => {
        getLogList();
      });
    },
  });

  function genLogContentText(content: string) {
    if (content) {
      content = content.replace(
        /\$\{\s*([\d]+|null)\s*(\|\s*[^\f\n\r\t\v\|\}]+){0,1}\s*\}/gi,
        function (val) {
          const pairs = val.split('|');
          const date = parseInt(pairs[0].replace(/[^0-9]/g, ''));
          let content = '空';
          if (!isNaN(date)) {
            const format = pairs.length > 1 ? trimEnd(pairs[1], '}') : 'YYYY-MM-DD';
            content = formatDate(date, format);
          }
          return content;
        },
      );
    }
    return content;
  }

  async function getLogList() {
    loading.value = true;
    await nextTick();
    const values = getFieldsValue() as GetLogListParam;
    try {
      const { items, totalCount } = await getLogListApi(values);
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  getLogList();
</script>

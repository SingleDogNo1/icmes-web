<template>
  <PageWrapper :content-full-height="true" :dense="true" :title="title" needBack>
    <Spin :spinning="loading">
      <Row class="p-4" :gutter="12">
        <Col :span="12">
          <StepForm
            v-if="cutTickets"
            :ticket="cutTickets"
            type="cut"
            :loading="cutLoading"
            @save="saveCut"
          />
        </Col>
        <Col :span="12">
          <StepForm
            v-if="supplyTickets"
            :ticket="supplyTickets"
            type="supply"
            :loading="supplyLoading"
            @save="saveSupply"
          />
        </Col>
      </Row>
    </Spin>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ConfigStep',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { Spin, Row, Col } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import StepForm from './components/stepForm.vue';
  import { useRoute } from 'vue-router';
  import { getHvOperationApi, UpdateHvOperationTicketStepApi } from '/@/api/power/hvOperation';
  import {
    HvOperationTemplateStepModel,
    UpdateHvOperationStep,
  } from '/@/api/power/model/hvOperationModel';
  import { HvOperationTemplateTypeEnum } from '/@/enums/powerCutEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const route = useRoute();
  const { createMessage } = useMessage();

  const routeId = route.query.id as string;
  const title = ref('配置步骤');
  const loading = ref(false);
  const cutTickets = ref<Nullable<HvOperationTemplateStepModel[]>>(null);
  const supplyTickets = ref<Nullable<HvOperationTemplateStepModel[]>>(null);
  const cutLoading = ref(false);
  const supplyLoading = ref(false);

  onMounted(async () => {
    try {
      loading.value = true;
      const { steps, name, number } = await getHvOperationApi(routeId);

      title.value = `${number} ${name}`;

      const cut_tickets = steps?.reduce((res, pre) => {
        if (pre.type === HvOperationTemplateTypeEnum.CUT) res.push(pre);
        return res;
      }, [] as HvOperationTemplateStepModel[]);

      const supply_tickets = steps?.reduce((res, pre) => {
        if (pre.type === HvOperationTemplateTypeEnum.SUPPLY) res.push(pre);
        return res;
      }, [] as HvOperationTemplateStepModel[]);

      cutTickets.value = cut_tickets || [];
      supplyTickets.value = supply_tickets || [];
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  });

  async function saveCut(data: HvOperationTemplateStepModel[]) {
    try {
      cutLoading.value = true;
      const params = data.reduce((res, pre) => {
        res.push({
          id: pre.id || null,
          order: pre.order,
          step: pre.step,
          type: HvOperationTemplateTypeEnum.CUT,
        });
        return res;
      }, [] as UpdateHvOperationStep[]);

      await UpdateHvOperationTicketStepApi(routeId, { steps: params });

      const { steps } = await getHvOperationApi(routeId);

      const cut_tickets = steps?.reduce((res, pre) => {
        if (pre.type === HvOperationTemplateTypeEnum.CUT) res.push(pre);
        return res;
      }, [] as HvOperationTemplateStepModel[]);

      // TODO 重新请求列表，为表格赋值。为什么子组件中监听不到 props.ticket的变化
      cutTickets.value = cut_tickets || [];

      createMessage.success('保存成功');
    } catch (err: any) {
      error(err);
    } finally {
      cutLoading.value = false;
    }
  }
  async function saveSupply(data: HvOperationTemplateStepModel[]) {
    try {
      supplyLoading.value = true;
      const params = data.reduce((res, pre) => {
        res.push({
          id: pre.id || null,
          order: pre.order,
          step: pre.step,
          type: HvOperationTemplateTypeEnum.SUPPLY,
        });
        return res;
      }, [] as UpdateHvOperationStep[]);

      await UpdateHvOperationTicketStepApi(routeId, { steps: params });

      const { steps } = await getHvOperationApi(routeId);

      const supply_tickets = steps?.reduce((res, pre) => {
        if (pre.type === HvOperationTemplateTypeEnum.SUPPLY) res.push(pre);
        return res;
      }, [] as HvOperationTemplateStepModel[]);

      // TODO 重新请求列表，为表格赋值。为什么子组件中监听不到 props.ticket的变化
      supplyTickets.value = supply_tickets || [];

      createMessage.success('保存成功');
    } catch (err: any) {
      error(err);
    } finally {
      supplyLoading.value = false;
    }
  }
</script>

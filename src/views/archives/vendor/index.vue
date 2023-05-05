<template>
  <div :class="prefixCls">
    <BasicForm
      class="bg-white"
      :class="`${prefixCls}-form`"
      @register="registerSearchForm"
      @submit="getVendersList"
    />
    <div class="px-4">
      <BasicTable @register="registerTable" :loading="loading">
        <template #toolbar>
          <a-button :disabled="!hasEditPermission" type="primary" @click="createVendor">
            新建
          </a-button>
        </template>

        <template #type="{ record }">
          <span>{{ partnerTypeMap[record.type] }}</span>
        </template>

        <template #contact="{ record }">
          <Row>
            <Col v-if="record.contactName1 && record.contactPhone1" :span="24">
              {{ record.contactName1 }}: {{ record.contactPhone1 }}
            </Col>
            <Col v-if="record.contactName2 && record.contactPhone2" :span="24">
              {{ record.contactName2 }}: {{ record.contactPhone2 }}
            </Col>
            <Col v-if="record.contactName3 && record.contactPhone3" :span="24">
              {{ record.contactName3 }}: {{ record.contactPhone3 }}
            </Col>
          </Row>
        </template>

        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>

    <BasicModal
      :loading="modalLoading"
      v-bind="$attrs"
      :title="`${editType === 'create' ? '新建' : '编辑'}厂商资料`"
      @register="registerModal"
      @ok="handleSubmit"
    >
      <BasicForm @register="registerEditForm">
        <template #contactField="{ model }">
          <InputGroup>
            <Row :gutter="12" class="mb-5">
              <Col :span="9">
                <Input v-model:value="model['contactName1']" :maxlength="10" />
              </Col>
              <Col :span="2" class="text-center"> - </Col>
              <Col :span="13">
                <Input v-model:value="model['contactPhone1']" :minlength="4" :maxlength="14" />
              </Col>
            </Row>
          </InputGroup>
          <InputGroup>
            <Row :gutter="12" class="mb-5">
              <Col :span="9">
                <Input v-model:value="model['contactName2']" :maxlength="10" />
              </Col>
              <Col :span="2" class="text-center"> - </Col>
              <Col :span="13">
                <Input v-model:value="model['contactPhone2']" :minlength="4" :maxlength="14" />
              </Col>
            </Row>
          </InputGroup>
          <InputGroup>
            <Row :gutter="12">
              <Col :span="9">
                <Input v-model:value="model['contactName3']" :maxlength="10" />
              </Col>
              <Col :span="2" class="text-center"> - </Col>
              <Col :span="13">
                <Input v-model:value="model['contactPhone3']" :minlength="4" :maxlength="14" />
              </Col>
            </Row>
          </InputGroup>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ArchivesVendor',
  };
</script>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { searchVendorSchemas, editVendorSchemas, columns } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import {
    getVendorsListApi,
    delVendorApi,
    getVendorInterfaceApi,
    createVendorApi,
    editVendorApi,
  } from '/@/api/info/vendor';
  import {
    CreateVendorParams,
    EditVendorParams,
    GetVendorsListParams,
    VendorModel,
  } from '/@/api/info/model/vendorModel';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { Row, Col, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { error } from '/@/utils/log';

  const InputGroup = Input.Group;

  const {
    meta: { code: routePermissionCode },
  } = useRoute();
  const features = useUserStore().getFeature;
  const { getDictMap } = useUserState();
  const { createMessage } = useMessage();

  const { prefixCls } = useDesign('vendor');
  const partnerTypeMap = getDictMap('DT_PARTNER_TYPE');
  const loading = ref(false);
  const modalLoading = ref(false);
  const hasEditPermission = !!features[routePermissionCode!]?.VENDOR_EDIT;
  const editType = ref<'create' | 'edit' | ''>('');
  const editId = ref<number>();

  const [registerSearchForm, { getFieldsValue: getSearchFieldsValue }] = useForm({
    layout: 'inline',
    schemas: searchVendorSchemas,
    labelWidth: 40,
    autoSubmitOnEnter: true,
  });

  const [
    registerEditForm,
    {
      getFieldsValue: getEditFieldsValue,
      setFieldsValue: setEditFieldsValue,
      resetFields: resetEditFields,
      updateSchema: updateEditFieldsSchema,
      validate: validateEditForm,
    },
  ] = useForm({
    schemas: editVendorSchemas,
    labelWidth: 80,
    autoSubmitOnEnter: false,
    showActionButtonGroup: false,
  });

  const [registerModal, { openModal, closeModal }] = useModal();

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    ellipsis: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({
        current: page.current,
        pageSize: page.pageSize,
      });

      const value = getSearchFieldsValue() as GetVendorsListParams;
      const form = {
        ...value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };

      getVendersList(form);
    },
  });

  function createActions(record: VendorModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: async () => {
          editType.value = 'edit';
          editId.value = record.id;
          openModal(true, {});
          await nextTick();
          modalLoading.value = true;
          try {
            const data = await getVendorInterfaceApi();
            const options = data.reduce((res, pre) => {
              res.push({ label: pre.name, value: pre.name });
              return res;
            }, [] as { label: string; value: string }[]);
            updateEditFieldsSchema([
              { field: 'interfaceCustomer', componentProps: { options } },
              { field: 'code', componentProps: { disabled: true } },
            ]);
            setEditFieldsValue({
              address: record.address,
              code: record.code,
              contactName1: record.contactName1,
              contactName2: record.contactName2,
              contactName3: record.contactName3,
              contactPhone1: record.contactPhone1,
              contactPhone2: record.contactPhone2,
              contactPhone3: record.contactPhone3,
              interfaceCustomer: record.interfaceCustomer,
              name: record.name,
              type: record.type,
              versionTag: record.versionTag,
            });
          } catch (err: any) {
            error(err);
          } finally {
            modalLoading.value = false;
          }
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            loading.value = true;
            try {
              await delVendorApi(record.id);
              createMessage.success('删除成功');
              await nextTick();
              const values = getSearchFieldsValue() as GetVendorsListParams;
              await getVendersList(values);
            } catch (err: any) {
              error(err);
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  async function getVendersList(params: GetVendorsListParams) {
    loading.value = true;
    try {
      const { items, totalCount, totalPages } = await getVendorsListApi(params);
      console.log('items, totalCount, totalPages :>> ', items, totalCount, totalPages);

      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    await nextTick();
    const values = getSearchFieldsValue() as GetVendorsListParams;
    getVendersList(values);
  });

  async function createVendor() {
    editType.value = 'create';
    openModal(true, {});
    resetEditFields();
    await nextTick();
    modalLoading.value = true;
    try {
      const data = await getVendorInterfaceApi();
      const options = data.reduce((res, pre) => {
        res.push({ label: pre.name, value: pre.name });
        return res;
      }, [] as { label: string; value: string }[]);
      updateEditFieldsSchema([
        { field: 'interfaceCustomer', componentProps: { options } },
        { field: 'code', componentProps: { disabled: false } },
      ]);
    } catch (err: any) {
      error(err);
    } finally {
      modalLoading.value = false;
    }
  }

  async function handleSubmit() {
    // TODO 怎么校验插槽里自定义的联系人表单?
    await validateEditForm();
    await nextTick();
    const EditForm = getEditFieldsValue() as CreateVendorParams | EditVendorParams;
    console.log('getEditFieldsValue :>> ', EditForm);
    modalLoading.value = true;
    try {
      if (editType.value === 'create') {
        await createVendorApi(EditForm as CreateVendorParams);
      } else if (editType.value === 'edit') {
        await editVendorApi(editId.value!, EditForm as EditVendorParams);
      }
      createMessage.success('保存成功');
      closeModal();
      await nextTick();
      const searchForm = getSearchFieldsValue() as GetVendorsListParams;
      getVendersList(searchForm);
    } catch (err: any) {
      error(err);
    } finally {
      modalLoading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-vendor';
  @form-prefix-cls: ~'@{prefix-cls}-form';

  .@{prefix-cls} {
    @apply h-full flex flex-col overflow-hidden bg-white;
  }
  .@{form-prefix-cls} {
    padding: 20px 16px 0 !important;
  }
</style>

<template>
  <div :class="prefixCls">
    <BasicForm
      class="bg-white"
      :class="`${prefixCls}-form`"
      @register="register"
      @submit="handleSubmit"
    />

    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="12">
        <RolesTable
          :search-data="searchData"
          @select-row="handleSelectRow"
          @change-page="handleChangeDictTypePage"
        />
      </Col>
      <Col :span="12" class="pr-4">
        <Spin :spinning="loading">
          <RoleDetail
            :disabled="true"
            :selected-row="selectedRow"
            :row-permission="rowPermission"
            :row-user-data="rowUserData"
            @change-page="handleChangeUserListPage"
          />
        </Spin>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, Ref, onMounted } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './data';
  import { Row, Col, Spin } from 'ant-design-vue';
  import RolesTable from './components/rolesTable.vue';
  import RoleDetail from './components/roleDetail.vue';
  import {
    GetRoleListParams,
    RoleModel,
    GetAccountOrgResultModel,
  } from '/@/api/account/model/rolesModel';
  import { getRoleFeaturesByIdApi, getRolesUserListByIdApi } from '/@/api/account/roles';

  const { prefixCls } = useDesign('role');

  const loading = ref<boolean>(false);
  let searchData = ref({}) as Ref<GetRoleListParams>;
  const selectedRow = ref<Nullable<RoleModel>>(null); // 点击选中行的数据
  const rowPermission = ref<string[]>([]); // 点击选中行,查询到对应的角色权限
  const rowUserData = ref<Nullable<GetAccountOrgResultModel>>(null); // 点击选中行,查询到对应的角色权限
  const getUserListOption = ref({
    orderBy: 'code',
    ascending: true,
    pageSize: 10,
    pageNo: 1,
  });

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  onMounted(() => {
    handleSubmit();
  });

  function handleSubmit() {
    nextTick(() => {
      const value = getFieldsValue() as GetRoleListParams;
      searchData.value = value;
    });
  }

  function getRolesUserList(id, options = getUserListOption.value) {
    const params = Object.assign(options, { roleId: id });
    return getRolesUserListByIdApi(id, params);
  }

  async function handleSelectRow(row: RoleModel) {
    selectedRow.value = row;
    loading.value = true;

    try {
      const features = await getRoleFeaturesByIdApi(row.id);
      rowPermission.value = features.reduce((res, pre) => {
        res.push(pre.id.toString());
        return res;
      }, [] as string[]);

      const userData = await getRolesUserList(row.id);
      rowUserData.value = userData;
    } finally {
      loading.value = false;
    }
  }

  function handleChangeDictTypePage(page) {
    const value = getFieldsValue() as GetRoleListParams;

    const form = Object.assign(value, page);
    console.log('searchData :>> ', form);
    searchData.value = form;
  }

  async function handleChangeUserListPage(page) {
    const form = Object.assign(getUserListOption.value, page);
    console.log('form :>> ', form, selectedRow.value);
    const userData = await getRolesUserList(selectedRow.value?.id);
    rowUserData.value = userData;
  }
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-role';
  @form-prefix-cls: ~'@{namespace}-role-form';
  @content-prefix-cls: ~'@{namespace}-role-content-wrapper';

  .@{prefix-cls} {
    @apply h-full flex flex-col overflow-hidden;
  }

  .@{form-prefix-cls} {
    padding: 20px 16px 0 !important;
  }

  .@{content-prefix-cls} {
    @apply flex-1;
  }
</style>

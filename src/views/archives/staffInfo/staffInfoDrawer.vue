<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="title"
    width="38%"
    showFooter
    @register="registerDrawer"
    @ok="handleSubmit"
    @visible-change="toggleShow"
  >
    <BasicForm @register="registerForm">
      <template #officePhoneField="{ model }: any">
        <Input.Group>
          <Row :gutter="10">
            <Col :span="16">
              <Row :gutter="6" align="middle">
                <Col :span="6">
                  <Form.ItemRest>
                    <Input
                      v-model:value="model['officePhoneArea']"
                      :maxlength="4"
                      @change="typeIsNumber($event, model, 'officePhoneArea')"
                    />
                  </Form.ItemRest>
                </Col>
                <Col :span="3" class="text-center"> - </Col>
                <Col :span="15">
                  <Form.ItemRest>
                    <Input
                      v-model:value="model['officePhone']"
                      :maxlength="11"
                      @change="typeIsNumber($event, model, 'officePhone')"
                    />
                  </Form.ItemRest>
                </Col>
              </Row>
            </Col>
            <Col :span="8">
              <Form.ItemRest>
                <Input
                  addon-before="分机号"
                  v-model:value="model['officePhoneExt']"
                  :maxlength="4"
                  @change="typeIsNumber($event, model, 'officePhoneExt')"
                />
              </Form.ItemRest>
            </Col>
          </Row>
        </Input.Group>
      </template>

      <template #category="{ model, field }: any">
        <Input v-model:value="categoryMap[model[field]]" disabled />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { Form, Row, Col, Input } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {
    EmployeeFullNameModel,
    EditEmployeeInfoParam,
    CreateEmployeeParams,
  } from '/@/api/info/model/employeeModel';
  import { BasicForm, useForm } from '/@/components/Form';
  import { userInfoSchemas as schemas } from './data';
  import { useUserState } from '/@/hooks/web/useUserState';
  import {
    getEmployeeInfoByIdApi,
    createEmployeeApi,
    editEmployeeInfoByIdApi,
  } from '/@/api/info/employee';
  import { error } from '/@/utils/log';

  const emit = defineEmits(['done']);

  const { getDictMap } = useUserState();

  const title = ref('');
  const type = ref<'create' | 'edit' | undefined>();
  const editId = ref(-1);
  // 员工类型映射
  const categoryMap = getDictMap('DT_CATEGORY');
  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate, clearValidate }] =
    useForm({
      labelWidth: 100,
      schemas,
      showActionButtonGroup: false,
    });
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
    async (record: Nullable<EmployeeFullNameModel>) => {
      title.value = `${record?.id ? '编辑' : '新建'}员工信息`;
      type.value = record?.id ? 'edit' : 'create';

      if (record?.id) {
        setDrawerProps({ loading: true });
        editId.value = record.id;
        updateSchema([
          { field: 'code', componentProps: { disabled: true } },
          { field: 'name', componentProps: { disabled: true } },
        ]);
        try {
          const data = await getEmployeeInfoByIdApi(record.id);
          console.log('data :>> ', data);
          // TODO antd-vue datePicker 组件，值的格式是 number 时报错，必须转成 string 才行，怎么解决？？？
          const parseData: any = cloneDeep(data);
          parseData.joinDate = data.joinDate ? data.joinDate.toString() : data.joinDate;
          parseData.birthDate = data.birthDate ? data.birthDate.toString() : data.birthDate;
          parseData.graduationDate = data.graduationDate
            ? data.graduationDate.toString()
            : data.graduationDate;

          setFieldsValue(parseData);
        } catch (err: any) {
          error(err);
        } finally {
          setDrawerProps({ loading: false });
        }
      }
    },
  );

  /** 只能输入数字 */
  function typeIsNumber(ev, model, type) {
    const value = ev.target.value;
    model[type] = value.replace(/[^\d]/g, '');
  }

  async function handleSubmit() {
    await validate();
    await nextTick();
    const values = getFieldsValue() as CreateEmployeeParams | EditEmployeeInfoParam;

    try {
      if (type.value === 'create') {
        await createEmployeeApi(values as CreateEmployeeParams);
      } else if (type.value === 'edit') {
        await editEmployeeInfoByIdApi(editId.value, values as EditEmployeeInfoParam);
      }
      emit('done');
      closeDrawer();
    } catch (err: any) {
      error(err);
    }
  }

  function toggleShow(show: boolean) {
    if (!show) {
      clearValidate();
      updateSchema([
        { field: 'code', componentProps: { disabled: false } },
        { field: 'name', componentProps: { disabled: false } },
      ]);
    }
  }
</script>

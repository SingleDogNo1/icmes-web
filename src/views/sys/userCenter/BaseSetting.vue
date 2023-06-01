<template>
  <CollapseContainer title="个人资料" :canExpan="false">
    <Row :gutter="24">
      <Col :span="14">
        <BasicForm @register="register" :loading="true">
          <template #officePhoneField="{ model }: any">
            <InputGroup>
              <Row :gutter="10">
                <Col :span="16">
                  <Row :gutter="6" align="middle">
                    <Col :span="6">
                      <FormItemRest>
                        <Input
                          v-model:value="model['officePhoneArea']"
                          :maxlength="4"
                          @change="typeIsNumber($event, model, 'officePhoneArea')"
                        />
                      </FormItemRest>
                    </Col>
                    <Col :span="3" class="text-center"> - </Col>
                    <Col :span="15">
                      <FormItemRest>
                        <Input
                          v-model:value="model['officePhone']"
                          :maxlength="11"
                          @change="typeIsNumber($event, model, 'officePhone')"
                        />
                      </FormItemRest>
                    </Col>
                  </Row>
                </Col>
                <Col :span="8">
                  <FormItemRest>
                    <Input
                      addon-before="分机号"
                      v-model:value="model['officePhoneExt']"
                      :maxlength="4"
                      @change="typeIsNumber($event, model, 'officePhoneExt')"
                    />
                  </FormItemRest>
                </Col>
              </Row>
            </InputGroup>
          </template>

          <template #category="{ model, field }: any">
            <Input v-model:value="categoryMap[model[field]]" disabled />
          </template>
        </BasicForm>
      </Col>
      <Col :span="10">
        <div class="change-avatar">
          <CropperAvatar
            :uploadApi="uploadAvatarApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </Col>
    </Row>
    <Button type="primary" @click="handleSubmit"> 保存 </Button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Button, Row, Col, Input, Form } from 'ant-design-vue';
  import { computed, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';
  import headerImg from '/@/assets/images/avatar.png';
  import { getEmployeeInfoByIdApi, editEmployeeInfoByIdApi } from '/@/api/info/employee';
  import { EditEmployeeInfoParam } from '/@/api/info/model/employeeModel';
  import { baseSetSchemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadAvatarApi } from '/@/api/account/basic';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { cloneDeep } from 'lodash-es';
  import { error } from '/@/utils/log';

  const InputGroup = Input.Group;
  const FormItemRest = Form.ItemRest;

  const { createMessage } = useMessage();
  const { getDictMap } = useUserState();
  const { getUserInfo: userInfo, setUserInfo } = useUserStore();

  // 员工类型映射
  const categoryMap = getDictMap('DT_CATEGORY');

  const avatar = computed(() => {
    const { avatar } = userInfo!;
    return avatar || headerImg;
  });

  const loading = ref<boolean>(false);

  const [register, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: baseSetSchemas,
    showActionButtonGroup: false,
  });

  function updateAvatar(src) {
    userInfo && (userInfo.avatar = src as string);
    setUserInfo(userInfo);
  }

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as EditEmployeeInfoParam;
    const { employeeId } = userInfo!;
    loading.value = true;

    try {
      await editEmployeeInfoByIdApi(employeeId, value);
      createMessage.success('保存成功！');
      // 更新数据源，主要是更新 versionTag，上次的操作记录已经失效
      const data = await getEmployeeInfoByIdApi(employeeId);
      setFieldsValue(data);
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  /** 只能输入数字 */
  function typeIsNumber(ev, model, type) {
    const value = ev.target.value;
    model[type] = value.replace(/[^\d]/g, '');
  }

  onMounted(async () => {
    loading.value = true;
    const { employeeId } = userInfo!;
    const data = await getEmployeeInfoByIdApi(employeeId);
    // setFieldsValue(data);
    // TODO antd-vue datePicker 组件，值的格式是 number 时报错，必须转成 string 才行，怎么解决？？？
    const parseData: any = cloneDeep(data);
    parseData.joinDate = data.joinDate ? data.joinDate.toString() : data.joinDate;
    parseData.birthDate = data.birthDate ? data.birthDate.toString() : data.birthDate;
    parseData.graduationDate = data.graduationDate
      ? data.graduationDate.toString()
      : data.graduationDate;

    setFieldsValue(parseData);
    loading.value = false;
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>

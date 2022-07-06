<template>
  <Tooltip placement="bottom" :overlayClassName="prefixCls">
    <template #title>
      <p>{{ desc }}</p>
      <div class="device-item" v-for="item in devicesList" :key="item.deviceId">
        <img
          v-if="item.powerType === DevicePowerTypeCodesEnum['HIGH_VOLTAGE']"
          src="../images/isHv.png"
          alt=""
        />
        <img
          v-else-if="item.powerType === DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE']"
          src="../images/isHvRo.png"
          alt=""
        />
        <img
          v-else-if="
            [
              DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
              DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE'],
            ].includes(item.powerType)
          "
          src="../images/isRo.png"
          alt=""
        />
        <span>
          {{ item.deviceCode ? item.deviceCode + item.deviceName : item.deviceName }}
        </span>
      </div>
    </template>
    <Tag
      style="margin-right: 4px; margin-bottom: 4px"
      v-for="item in devicesList"
      :key="item.deviceId"
      :color="primaryColor"
      @click.stop="chooseItem(item)"
    >
      {{ item.processNo ? item.processNo : item.deviceCode ? item.deviceCode : item.deviceName }}
    </Tag>
  </Tooltip>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Tooltip, Tag } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { DeviceInfoModel } from '/@/api/power/model/basicModel';
  import { DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
  import { primaryColor } from '/@/settings/designSetting';

  defineProps({
    desc: {
      type: String,
      required: true,
    },
    devicesList: {
      type: Array as PropType<DeviceInfoModel[]>,
      required: true,
    },
  });
  const emit = defineEmits(['choose']);

  const { prefixCls } = useDesign('power-failure-device-tooltip');

  function chooseItem(item) {
    emit('choose', item);
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-power-failure-device-tooltip';
  .@{prefix-cls} {
    .device-item {
      display: flex;
      font-size: 14px;
      margin-bottom: 10px;

      img {
        height: 20px;
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>

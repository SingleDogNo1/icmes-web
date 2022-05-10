import { shallowRef, readonly } from 'vue';
import PowerCutType from './powerCutType/index.vue';
import DeviceChargedType from './deviceChargedType/index.vue';
import PLCJudgmentRule from './plcJudgmentRule/index.vue';
import SafetyTechnology from './safetyTechnology/index.vue';
import OperationTicket from './operationTicket/index.vue';
import PowerSystemList from './powerSystemList.vue';
import ElectricianSetting from './electricianSetting/index.vue';
import ErrorMessage from './errorMessage.vue';

export const tabsList = readonly([
  { key: '1', name: '停送电类型', component: shallowRef(PowerCutType) },
  { key: '2', name: '设备带电类型', component: shallowRef(DeviceChargedType) },
  { key: '3', name: 'PLC判断规则', component: shallowRef(PLCJudgmentRule) },
  { key: '4', name: '安全技术措施', component: shallowRef(SafetyTechnology) },
  { key: '5', name: '高压操作票', component: shallowRef(OperationTicket) },
  { key: '6', name: '供电系统图', component: shallowRef(PowerSystemList) },
  { key: '7', name: '验证配置', component: shallowRef(ElectricianSetting) },
  { key: '8', name: '异常消息', component: shallowRef(ErrorMessage) },
]);

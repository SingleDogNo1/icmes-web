import { ContainStatus } from '/@/api/sys/model/userModel';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();
const passwordValidation = userStore.getPasswordValidation;
/**
 * @description 校验密码框输入
 * @param {string} inputVal 输入框中的值
 * @param {number} value 需要校验的参数对应的标识。 0 - 不可以包含; 1 - 可以包含; 2 - 必须包含
 * @param {string} key 需要校验的参数
 * @params {RegExp} reg 校验使用的正则表达式
 */

function validatePWD(inputVal: string, value: ContainStatus, key: string, reg: RegExp) {
  const Key = key.replace(key[0], key[0].toUpperCase());
  if (value === ContainStatus.CANT_BE) {
    if (inputVal.match(reg)) {
      const $key = 'excluding' + Key;
      return Promise.reject(passwordValidation?.errorMessage[$key]);
    } else {
      return Promise.resolve();
    }
  } else if (value === ContainStatus.MUST_BE) {
    if (!inputVal.match(reg)) {
      const $key = 'contain' + Key;
      return Promise.reject(passwordValidation?.errorMessage[$key]);
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
}

export async function validPassword(value) {
  const number = /[0-9]/;
  const lowercase = /[a-z]/;
  const capital = /[A-Z]/;
  const character = /[#?!@$%^&*+-.]/;

  const complex = passwordValidation?.complex;
  const maxLength = passwordValidation?.length.max;
  const minLength = passwordValidation?.length.min;
  const lengthTips = passwordValidation?.errorMessage.lengthTips;
  const spaceErrorTip = passwordValidation?.errorMessage.containSpace;

  if (value.includes(' ')) {
    // 校验密码有空格
    return Promise.reject(spaceErrorTip);
  }
  if (value.length < minLength! || value.length > maxLength!) {
    // 校验密码长度
    return Promise.reject(lengthTips);
  }

  for (const key in complex) {
    const val = complex[key];
    if (key === 'number') {
      await validatePWD(value, val, key, number);
    } else if (key === 'lowercase') {
      await validatePWD(value, val, key, lowercase);
    } else if (key === 'capital') {
      await validatePWD(value, val, key, capital);
    } else if (key === 'character') {
      await validatePWD(value, val, key, character);
    }
  }
}

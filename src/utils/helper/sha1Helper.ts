import CryptoJS from 'crypto-js';
import { isString, isObject } from '../is';
import { forEach } from 'lodash-es';

export function encryptSalt(data) {
  const salt = CryptoJS.MD5(data).toString();
  const result = CryptoJS.MD5(salt + data).toString();
  return result;
}

export function encryptPwd(data, aesKey) {
  const key = CryptoJS.enc.Utf8.parse(aesKey + aesKey.substr(0, 6));
  const aesOption = {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  };
  if (isString(data)) {
    const ciphertext = CryptoJS.AES.encrypt(data, key, aesOption).ciphertext;
    return CryptoJS.enc.Hex.stringify(ciphertext).toString();
  }

  if (isObject(data)) {
    const obj = {};
    forEach(data, function (value, key) {
      obj[key] = key === 'key' ? value : encryptPwd(value, aesKey);
    });
    return obj;
  }

  return '';
}

import MD5 from 'crypto-js/md5';
import UTF8 from 'crypto-js/enc-utf8';
import HEX from 'crypto-js/enc-hex';
import padding from 'crypto-js/pad-zeropadding';
import { encrypt } from 'crypto-js/aes';
import { forEach, isString, isObject } from 'lodash-es';

export function encryptSalt(data) {
  return MD5(MD5(data).toString() + data).toString();
}

export function encryptPwd(data, aesKey) {
  const iv = UTF8.parse(aesKey + aesKey.substr(0, 6));
  const aesOption = { iv, padding };
  if (isString(data)) {
    return HEX.stringify(encrypt(data, iv, aesOption).ciphertext).toString();
  }

  if (isObject(data)) {
    const obj = {};
    forEach(data, (value, key) => {
      obj[key] = key === 'key' ? value : encryptPwd(value, aesKey);
    });
    return obj;
  }

  return '';
}

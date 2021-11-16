import MD5 from 'crypto-js/md5';
import UTF8 from 'crypto-js/enc-utf8';
import HEX from 'crypto-js/enc-hex';
import padding from 'crypto-js/pad-zeropadding';
import { encrypt } from 'crypto-js/aes';
import { forEach, isString, isObject } from 'lodash-es';

export function encryptSalt(data) {
  const salt = MD5(data).toString();
  const result = MD5(salt + data).toString();
  return result;
}

export function encryptPwd(data, aesKey) {
  const iv = UTF8.parse(aesKey + aesKey.substr(0, 6));
  const aesOption = { iv, padding };
  if (isString(data)) {
    const ciphertext = encrypt(data, iv, aesOption).ciphertext;
    return HEX.stringify(ciphertext).toString();
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

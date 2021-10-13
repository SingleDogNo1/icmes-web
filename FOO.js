const str =
  '{"source":"server","type":"notify","data":"{"businessCreateUserId":0,"businessCreateUserName":"系统","businessData":"{}","businessKey":"","businessType":"REFRESH_PERMISSION_STATUS","id":"e47d08e4-fc90-43ee-93bf-e97a43bef7ed","messageType":"PERMISSION","updateTime":1634116672490}"}';

// const res = str.match(/{.+}/g)[0];
console.log('res :>> ', JSON.parse(str));

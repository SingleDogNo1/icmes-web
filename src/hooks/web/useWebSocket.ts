import { h, unref } from 'vue';
import { useWebSocket as baseSocket } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { getPermissionApi } from '/@/api/account/basic';
import { router } from '/@/router';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useMessage } from './useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { REDIRECT_NAME } from '/@/router/constant';
import { notification } from 'ant-design-vue';

const { socketUrl } = useGlobSetting();
const userStore = useUserStoreWithOut();
const permissionStore = usePermissionStoreWithOut();
const employeeId = userStore.getUserInfo?.employeeId;

export function useWebSocket() {
  if (!employeeId) return;
  const { send, data, status, open, close } = baseSocket(
    `${socketUrl}/?token=00000000-0000-0000-0000-000000000000&uid=${employeeId}_web&transport=websocket`,
    {
      autoReconnect: true,
      heartbeat: {
        message: 'ping',
        interval: 1000,
      },
      onConnected() {
        console.log('websocket 连接成功: ' + new Date().toLocaleString());
      },
      onDisconnected() {
        console.log('websocket 断开连接: ' + new Date().toLocaleString());
      },
      onMessage(_ws, { data }) {
        if (data.includes('broadcast')) {
          const res = JSON.parse(data.match(/{.+}/g)[0]);
          if (res.source !== 'server') return;

          const messageData = JSON.parse(res.data);
          const businessData = JSON.parse(messageData.businessData);
          const { createConfirm } = useMessage();
          const { t } = useI18n();
          switch (messageData.messageType) {
            case 'PERMISSION':
              createConfirm({
                iconType: 'warning',
                title: () => h('span', t('sys.app.logoutTip')),
                content: () => h('span', t('common.resetPermissionText')),
                onOk: async () => {
                  try {
                    const { featureScopes, features } = await getPermissionApi();
                    userStore.setAuthFeatures(featureScopes);
                    userStore.setFeature(features);
                    userStore.getUserInfoAction();
                    const routes = await permissionStore.buildRoutesAction();

                    routes.forEach((route) => {
                      router.addRoute(route as unknown as RouteRecordRaw);
                    });
                    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

                    // 刷新当前页
                    const { push, currentRoute } = router;
                    console.log('push, currentRoute :>> ', push, currentRoute);
                    const { query, params = {}, name, fullPath } = unref(currentRoute.value);

                    return new Promise((resolve) => {
                      if (name === REDIRECT_NAME) {
                        resolve(false);
                        return;
                      }
                      if (name && Object.keys(params).length > 0) {
                        params['_redirect_type'] = 'name';
                        params['path'] = String(name);
                      } else {
                        params['_redirect_type'] = 'path';
                        params['path'] = fullPath;
                      }
                      push({ name: REDIRECT_NAME, params, query }).then(() => resolve(true));
                    });
                  } catch (error) {
                    throw new Error(JSON.stringify(error));
                  }
                },
              });
              break;
            case 'MESSAGE':
              console.log('消息通知 :>> ', businessData);
              notification.info({
                message: businessData.title,
                description: businessData.content,
              });
              break;
            case 'CARBON':
              console.log('抄送通知 :>> ', businessData);
              notification.info({
                message: businessData.title,
                description: businessData.content,
              });
              break;
            case 'TASK':
              console.log('任务通知 :>> ', businessData);
              notification.info({
                message: businessData.title,
                description: businessData.content,
              });
              break;
            case 'APPROVAL':
              console.log('审批通知 :>> ', businessData);
              notification.info({
                message: businessData.title,
                description: businessData.content,
              });
              break;
            case 'DICTIONARY':
              console.log('字典变更通知 :>> ', businessData);
              notification.info({
                message: businessData.title,
                description: businessData.content,
              });
              break;
            case 'LOGIN':
              console.log('LOGIN :>> ', messageData.businessData);
              break;
            case 'ETM_REAL_TIME':
              console.log('ETM_REAL_TIME :>> ', messageData.businessData);
              break;
            case 'POWER_CUT_FORM_TODAY_COUNT':
              console.log('POWER_CUT_FORM_TODAY_COUNT :>> ', messageData.businessData);
              break;
          }
        }
      },
    },
  );

  return {
    send,
    data,
    status,
    open,
    close,
  };
}

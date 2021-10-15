import { useWebSocket as baseSocket } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { getPermissionApi } from '/@/api/account/basic';
import { router } from '/@/router';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { PageEnum } from '/@/enums/pageEnum';
import { useMessage } from './useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';

const { socketUrl } = useGlobSetting();
const userStore = useUserStoreWithOut();
const permissionStore = usePermissionStoreWithOut();
const employeeId = userStore.getUserInfo?.employeeId;

export function useWebSocket() {
  if (!employeeId) return;
  baseSocket(
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
      onMessage(_ws, { data }) {
        if (data.includes('broadcast')) {
          const res = JSON.parse(data.match(/{.+}/g)[0]);
          if (res.source !== 'server') return;

          const messageData = JSON.parse(res.data);
          const { createConfirm } = useMessage();
          const { t } = useI18n();
          switch (messageData.messageType) {
            case 'PERMISSION':
              createConfirm({
                iconType: 'warning',
                title: () => h('span', t('sys.app.logoutTip')),
                content: () => h('span', t('common.resetPermissionText')),
                onOk: async () => {
                  getPermissionApi()
                    .then((data) => {
                      userStore.setAuthFeatures(data.featureScopes);
                      userStore.setFeature(data.features);
                    })
                    .then(() => {
                      userStore.getUserInfoAction();
                    })
                    .then(() => {
                      permissionStore.buildRoutesAction().then((routes) => {
                        routes.forEach((route) => {
                          router.addRoute(route as unknown as RouteRecordRaw);
                        });
                        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

                        // TODO 应跳转到当前页 || 首页
                        router.replace(PageEnum.BASE_HOME);
                      });
                    });
                },
              });

              break;
            case 'MESSAGE':
              console.log('消息通知 :>> ');
              break;
            case 'CARBON':
              console.log('抄送通知 :>> ');
              break;
            case 'TASK':
              console.log('任务通知 :>> ');
              break;
            case 'APPROVAL':
              console.log('审批通知 :>> ');
              break;
            case 'DICTIONARY':
              console.log('字典变更通知 :>> ');
              break;
            case 'LOGIN':
              console.log('LOGIN :>> ');
              break;
          }
        }
      },
      onDisconnected() {
        console.log('websocket 断开连接: ' + new Date().toLocaleString());
      },
    },
  );
}

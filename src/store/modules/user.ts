import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import type { Menu } from '/@/api/info/model/configModel';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  AUTH_FEATURE_KEY,
  FEATURE_KEY,
  MENU_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { logoutApi, loginApi, getPublicKeyApi } from '/@/api/sys/user';
import { getRemoteConfigApi } from '/@/api/info/config';
import { getRolesListByIdApi } from '/@/api/account/roles';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { h } from 'vue';
import { encryptSalt, encryptPwd } from '/@/utils/helper/sha1Helper';

type Feature = { [index: string]: { [index: string]: boolean } };

interface UserState {
  token?: string;
  userId?: number;
  name?: string;
  employeeId?: number;
  organizationId?: string | number;
  avatar?: string;
  featureScopes?: { [index: string]: number[] };
  feature?: Feature;
  userInfo: Nullable<UserInfo>;
  roleList: string[];
  menu: Nullable<Menu>;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // token
    token: undefined,
    featureScopes: undefined,
    feature: undefined,
    // user info
    userInfo: null,
    // roleList
    roleList: [],
    menu: null,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || null;
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getFeature(): Feature {
      return this.feature || getAuthCache<Feature>(FEATURE_KEY);
    },
    getMenu(): Menu {
      return this.menu || getAuthCache<Menu>(MENU_KEY);
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setAuthFeatures(features: { [index: string]: number[] }) {
      this.featureScopes = features ?? {};
      setAuthCache(AUTH_FEATURE_KEY, features);
    },
    setFeature(features: { [index: string]: { [index: string]: boolean } }) {
      this.feature = features ?? {};
      setAuthCache(FEATURE_KEY, features);
    },
    setMenu(menu: Menu | null) {
      this.menu = menu ?? null;
      setAuthCache(MENU_KEY, menu);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.menu = null;
      this.token = '';
      this.roleList = [];
      this.featureScopes = undefined;
      this.feature = undefined;
      this.sessionTimeout = false;
    },
    getRemoteConfig() {
      return getRemoteConfigApi();
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const remoteConfig = await this.getRemoteConfig();
        const { key, codeList } = await getPublicKeyApi();
        const { goHome = true, mode, ...loginParams } = params;
        const encryptSaltPassword = encryptSalt(loginParams.password);
        const aesKey = codeList.reduce((res, pre, index) => {
          res += pre[index];
          return res;
        }, '');
        const password = encryptPwd(encryptSaltPassword, aesKey) as unknown as string;
        const data = await loginApi(
          {
            employeeCode: loginParams.employeeCode,
            password,
            key,
          },
          mode,
        );

        this.setToken(data.accessToken);
        this.setMenu(remoteConfig.menus);

        this.setUserInfo({
          userId: data.userId,
          name: data.name,
          employeeId: data.employeeId,
          organizationId: data.organizationId,
          avatar: data.avatar,
        });
        this.setAuthFeatures(data.featureScopes);
        if (data.features) {
          for (const x in data.features) {
            if (x === '28100') {
              if (
                !data.features['28100'].SAFTY_VIEW &&
                !data.features['28100'].SAFTY_EXPORT &&
                !data.features['28100'].SAFTY_EDIT
              ) {
                delete data.features['28100'];
              }
            }
          }
          this.setFeature(data.features);
        }

        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;

      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const feature = this.getFeature;
        const permCodes = Object.keys(feature);
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome &&
          (await router.replace(
            permCodes.includes('27500' as never) ? '/board/productionBoard' : PageEnum.BASE_HOME,
          ));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = this.getUserInfo;
      this.setUserInfo(userInfo);
      const { items: rolesList } = await getRolesListByIdApi(userInfo.employeeId, {
        ascending: true,
        orderBy: 'organizationId',
        pageNo: 0,
        pageSize: 0,
      });

      const roles = rolesList.reduce((res, pre) => {
        res.push(pre.roleCode);
        return res;
      }, [] as string[]);
      this.setRoleList(roles);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await logoutApi();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setAuthFeatures({});
      this.setFeature({});
      this.setMenu(null);
      this.setRoleList([]);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}

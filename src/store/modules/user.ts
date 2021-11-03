import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import type { Menu, Dict } from '/@/api/info/model/configModel';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import {
  USER_INFO_KEY,
  AUTH_FEATURE_KEY,
  FEATURE_KEY,
  FEATURE_TREE_KEY,
  MENU_KEY,
  DICTS_KEY,
  ROLES_KEY,
  TOKEN_KEY,
  PWD_VALIDATE_KEY,
  USER_DATA_RATE_KEY,
  DEVICE_LIST_KEY,
  ACCOUNT_KEY,
  ACCOUNT_TREE_KEY,
  ORGANIZATION_KEY,
} from '/@/enums/userEnums';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
  resetPwdParams,
} from '/@/api/sys/model/userModel';
import { DeviceModel } from '/@/api/info/model/devicesModel';
import {
  OrganizationEmployeeModel,
  OrganizationsFullNameModel,
} from '/@/api/info/model/organizationsModel';
import { logoutApi, loginApi, getPublicKeyApi, resetPwdApi } from '/@/api/sys/user';
import { getAllAccountTreeApi, getOrganizationsListApi } from '/@/api/info/organizations';
import { getRemoteConfigApi } from '/@/api/info/config';
import { getDevicesListApi } from '/@/api/info/devices';
import { getRolesListByIdApi } from '/@/api/account/roles';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { h } from 'vue';
import { encryptSalt, encryptPwd } from '/@/utils/helper/sha1Helper';
import { LoginStateEnum, useLoginState } from '/@/views/sys/login/useLogin';
import { PasswordValidationModel } from '/@/api/sys/model/userModel';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';

type Feature = { [index: string]: { [index: string]: boolean } };

export interface FeaturesTreeModel {
  id: string;
  isFeature: boolean;
  label: string;
  children?: FeaturesTreeModel[];
}

interface UserState {
  token?: string;
  userId?: number;
  name?: string;
  employeeId?: number;
  organizationId?: string | number;
  avatar?: string;
  featureScopes?: { [index: string]: number[] };
  feature?: Feature;
  featuresTree: FeaturesTreeModel[];
  userInfo: Nullable<UserInfo>;
  roleList: string[];
  menu: Nullable<Menu>;
  dicts: Nullable<Dict>;
  passwordValidation: Nullable<PasswordValidationModel>;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  dataRate: number;
  devicesList: Nullable<DeviceModel[]>;
  account: Nullable<OrganizationEmployeeModel[]>;
  accountTree: Nullable<OrganizationEmployeeModel>;
  organizations: Nullable<OrganizationsFullNameModel[]>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // token
    token: undefined,
    featureScopes: undefined,
    feature: undefined,
    featuresTree: [],
    // user info
    userInfo: null,
    // roleList
    roleList: [],
    menu: null,
    dicts: null,
    passwordValidation: null,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    dataRate: 1,
    devicesList: null,
    account: null,
    accountTree: null,
    organizations: null,
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
    getFeaturesTree(): FeaturesTreeModel[] {
      return this.featuresTree.length > 0
        ? this.featuresTree
        : getAuthCache<FeaturesTreeModel[]>(FEATURE_TREE_KEY);
    },
    getMenu(): Menu {
      return this.menu || getAuthCache<Menu>(MENU_KEY);
    },
    getDicts(): Dict {
      return this.dicts || getAuthCache<Dict>(DICTS_KEY);
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getPasswordValidation(): PasswordValidationModel {
      return this.passwordValidation || getAuthCache<PasswordValidationModel>(PWD_VALIDATE_KEY);
    },
    getDataRate(): number {
      return this.dataRate || getAuthCache<number>(USER_DATA_RATE_KEY);
    },
    getDevicesList(): DeviceModel[] | null {
      return this.devicesList || getAuthCache<DeviceModel[]>(DEVICE_LIST_KEY);
    },
    getAllAccount(): OrganizationEmployeeModel[] | null {
      return this.account || getAuthCache<OrganizationEmployeeModel[]>(ACCOUNT_KEY);
    },
    getAllAccountTree(): OrganizationEmployeeModel | null {
      return this.accountTree || getAuthCache<OrganizationEmployeeModel>(ACCOUNT_TREE_KEY);
    },
    getOrganizationsList(): OrganizationsFullNameModel[] | null {
      return this.organizations || getAuthCache<OrganizationsFullNameModel[]>(ORGANIZATION_KEY);
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
      this.token = info ?? ''; // for null or undefined value
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
    setFeaturesTree(featuresTree: FeaturesTreeModel[]) {
      this.featuresTree = featuresTree ?? [];
      setAuthCache(FEATURE_TREE_KEY, featuresTree);
    },
    setMenu(menu: Menu | null) {
      this.menu = menu ?? null;
      setAuthCache(MENU_KEY, menu);
    },
    setDicts(dicts: Dict | null) {
      this.dicts = dicts ?? null;
      setAuthCache(DICTS_KEY, dicts);
    },
    setPasswordValidation(valid: PasswordValidationModel | null) {
      this.passwordValidation = valid ?? null;
      setAuthCache(PWD_VALIDATE_KEY, valid);
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
    setDataRate(rate: number) {
      this.dataRate = rate;
      setAuthCache(USER_DATA_RATE_KEY, rate);
    },
    setDeviceList(devices: DeviceModel[] | null) {
      this.devicesList = devices;
      setAuthCache(DEVICE_LIST_KEY, devices);
    },
    setAllAccount(accountList: OrganizationEmployeeModel[] | null) {
      this.account = accountList;
      setAuthCache(ACCOUNT_KEY, accountList);
    },
    setAllAccountTree(accountTree: OrganizationEmployeeModel | null) {
      this.accountTree = accountTree;
      setAuthCache(ACCOUNT_TREE_KEY, accountTree);
    },
    setOrganizationsList(organizations: OrganizationsFullNameModel[] | null) {
      this.organizations = organizations;
      setAuthCache(ORGANIZATION_KEY, organizations);
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

    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const remoteConfig = await this.getRemoteConfig();
        const { key, codeList } = await getPublicKeyApi();
        const { mode, ...loginParams } = params;
        const encryptSaltPassword = encryptSalt(loginParams.password);
        const aesKey = codeList.reduce((res, pre, index) => {
          res += pre[index];
          return res;
        }, '');
        const password = encryptPwd(encryptSaltPassword, aesKey) as unknown as string;
        const userInfo = await loginApi(
          {
            employeeCode: loginParams.employeeCode,
            password,
            key,
          },
          mode,
        );
        this.setMenu(remoteConfig.menus);
        this.setDicts(remoteConfig.dicts);
        this.setFeaturesTree(remoteConfig.features);
        this.setPasswordValidation(JSON.parse(remoteConfig.passwordValidation));
        userInfo.accessToken && this.setToken(userInfo.accessToken);

        userInfo.accessToken &&
          this.setUserInfo({
            userId: userInfo.userId,
            name: userInfo.name,
            employeeId: userInfo.employeeId,
            organizationId: userInfo.organizationId,
            avatar: userInfo.avatar,
          });

        userInfo.featureScopes && this.setAuthFeatures(userInfo.featureScopes);
        if (userInfo.features) {
          for (const x in userInfo.features) {
            if (x === '28100') {
              if (
                !userInfo.features['28100'].SAFTY_VIEW &&
                !userInfo.features['28100'].SAFTY_EXPORT &&
                !userInfo.features['28100'].SAFTY_EDIT
              ) {
                delete userInfo.features['28100'];
              }
            }
          }
          this.setFeature(userInfo.features);
        }

        return this.afterLoginAction(userInfo);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    genAccountTree(list: { [key: string]: any }[], id: string, name: string) {
      const tree: { [key: string]: any }[] = [];
      list.map((item) => {
        const obj: { [key: string]: any } = cloneDeep(item);
        if (item.parentId === id) {
          obj.id = item.realEmployeeId || item.realOrgId + new Date().getTime();
          obj.parentName = name;
          obj.disabled = !item.isEmployee;
          if (item.realEmployeeId! >= 0) {
            obj.realEmployeeId = item.realEmployeeId;
          }
          obj.children = this.genAccountTree(list, item.id, item.name);
          obj.hasChild = obj.children?.length > 0;
          tree.push(obj);
        }
      });
      return tree;
    },
    async afterLoginAction(userInfo: LoginResultModel): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;

      await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const { setLoginState } = useLoginState();
        const { createMessage } = useMessage();
        const { t } = useI18n();

        if (userInfo.changePassword === true) {
          // 首次登录，强制修改初始密码
          createMessage.warning(t('sys.login.changePassword'));
          setLoginState(LoginStateEnum.RESET_PASSWORD);
        } else {
          // 根据权限，生成路由
          const permissionStore = usePermissionStore();
          if (!permissionStore.isDynamicAddedRoute) {
            const routes = await permissionStore.buildRoutesAction();
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw);
            });
            router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
            permissionStore.setDynamicAddedRoute(true);
          }
          // 根据权限， 跳转对应的路由
          const features = this.getFeature;
          const permCodes = Object.keys(features);
          router.replace(
            permCodes.includes('27500' as never) ? '/board/productionBoard' : PageEnum.BASE_HOME,
          );

          const { notification } = useMessage();
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
            duration: 3,
          });

          try {
            const { items: deviceList } = await getDevicesListApi({
              isPrimary: true,
              orderBy: 'processNo',
              organizationIds: [],
              isTreeForDeviceCategory: true,
              category: [],
              location: [],
              status: [],
              hierarchy: 0,
              globalName: '',
              ascending: true,
              parentId: -1,
              pageSize: 0,
              pageNo: 0,
            });
            const { items: allAccount } = await getAllAccountTreeApi({
              name: '',
            });
            const { items: organizationsList } = await getOrganizationsListApi({
              orderBy: 'Code',
              ascending: true,
              pageNo: 0,
              pageSize: 0,
            });

            this.setDeviceList(deviceList);
            this.setAllAccount(allAccount);

            const allAccountTree = this.genAccountTree(allAccount, '-1', '全体');
            this.setAllAccountTree(allAccountTree as unknown as OrganizationEmployeeModel);
            this.setOrganizationsList(organizationsList);
          } catch (error) {
            Promise.reject(error);
            console.log(error);
          }
        }
      }
      return userInfo;
    },
    async getUserInfoAction() {
      if (!this.getToken) return null;
      const userInfo = this.getUserInfo;
      this.setUserInfo(userInfo);
      const { items: rolesList } = await getRolesListByIdApi(userInfo.employeeId, {
        ascending: true,
        orderBy: 'organizationId',
        pageNo: 0,
        pageSize: 0,
      });

      const roles = rolesList
        ? rolesList.reduce((res, pre) => {
            res.push(pre.roleCode);
            return res;
          }, [] as string[])
        : [];
      this.setRoleList(roles);

      const {
        data: { rate },
      } = await axios.get(self.location.origin + '/dataRate.json');
      this.setDataRate(rate);
    },
    async resetPassword(
      params: resetPwdParams & {
        mode?: ErrorMessageMode;
      },
    ) {
      const { mode, ...resetPwdParams } = params;
      const { key, codeList } = await getPublicKeyApi();
      const aesKey = codeList.reduce((res, pre, index) => {
        res += pre[index];
        return res;
      }, '');
      const encryptSaltPassword = encryptSalt(resetPwdParams.password);
      const encryptSaltConfirmPassword = encryptSalt(resetPwdParams.confirmPassword);
      const pwdOptions = {
        password: encryptSaltPassword,
        confirmPassword: encryptSaltConfirmPassword,
        key,
      };

      const encryptOption = encryptPwd(pwdOptions, aesKey) as unknown as resetPwdParams;
      const result = await resetPwdApi(encryptOption, mode);

      if (!result) return;

      const permissionStore = usePermissionStore();
      if (!permissionStore.isDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction();
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        permissionStore.setDynamicAddedRoute(true);
      }
      // 根据权限， 跳转对应的路由
      const features = this.getFeature;
      const permCodes = Object.keys(features);
      router.replace(
        permCodes.includes('27500' as never) ? '/board/productionBoard' : PageEnum.BASE_HOME,
      );
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
      this.setPasswordValidation(null);
      this.setRoleList([]);
      this.setDataRate(1);
      this.setDeviceList(null);
      this.setAllAccount(null);
      this.setAllAccountTree(null);
      this.setOrganizationsList(null);
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

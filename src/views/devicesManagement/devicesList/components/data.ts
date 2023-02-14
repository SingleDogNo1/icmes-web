import { ref, createVNode, unref } from 'vue';
import { FormSchema } from '/@/components/Form';
import { getAllAccountTreeApi } from '/@/api/info/organizations';
import { getVendorsListApi } from '/@/api/info/vendor';
import { getProcessListApi } from '/@/api/info/process';
import { getLocationListApi } from '/@/api/info/location';
import { uploadDevicesPhotoApi, getCamerasListApi } from '/@/api/info/devices';
import { getDevicesCategoryListApi } from '/@/api/info/devicesCategory';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { useUserState } from '/@/hooks/web/useUserState';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGlobSetting } from '/@/hooks/setting';
import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
import { Image } from '/@/components/Image';

const { getFeature } = useUserStoreWithOut();

const { getDictOptions } = useUserState();
const { getOrganizationsList, getToken: token } = useUserStoreWithOut();
const { t } = useI18n();
const { apiUrl } = useGlobSetting();
const categoryList = ref<any[]>([]);

async function getProcessTree(params) {
  try {
    const { items } = await getProcessListApi(params);
    const tree = listToTreeAsParentId(items || []);
    return new Promise((resolve) => {
      resolve(tree);
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

/**
 {

  "isPrimary": true, // 是否是主设备
  "parentId": 0, // 主设备 -1 ，附属设备为主设备 id
  "photoList": [
    { "order": 0, "photo": "string" }
  ],
  "powerCutRelativeDeviceIds": [0],
  // "purchaseDate": 0, 购买日期

  "vendorId": 0
}
 */

export const editDeviceSchemas = (code: string): FormSchema[] => {
  const hasEditPricePermission = getFeature[code!].DEVICE_PRICE_VIEW;
  return [
    {
      field: 'processNo',
      label: '设备编号',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      field: 'employeeIds',
      label: '包机人',
      component: 'ApiTreeSelect',
      colProps: { span: 12 },
      componentProps: {
        mode: 'multiple',
        treeNodeFilterProp: 'name',
        treeCheckable: true,
        api: getAllAccountTreeApi,
        params: { name: '' },
        resultField: 'items',
        labelField: 'name',
        valueField: 'realId',
        fieldNames: {
          label: 'name',
          value: 'realId',
        },
        immediate: true,
        onOptionsReady: (options) => {
          /**
           * 递归的处理选项列表使父级节点不可选
           * @param list {Record<string, any}[] 需要处理的集合
           */
          function addDisabled(list) {
            list.map((v) => {
              v.name = v.code + ' ' + v.name; // 重组 name 字段，用于显示
              // 插入新字段，用做生成选中的 Id(如果是组织使用组织Id,该字段不会选中父节点所以无所谓父节点 id 的具体值，只需要保证其唯一性)
              v.realId = v.realEmployeeId || 'org_' + v.realOrgId;
              v.disabled = !!v.children?.length;
              v.children?.length && addDisabled(v.children);
            });
          }
          addDisabled(options);
          return options;
        },
      },
    },
    {
      field: 'code',
      label: '唯一编码',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'manufacturerId',
      label: '生产厂家',
      component: 'ApiSelect',
      colProps: { span: 12 },
      componentProps: {
        optionFilterProp: 'label',
        showSearch: true,
        api: getVendorsListApi,
        params: {
          organizationIds: [],
          pageSize: 0,
        },
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
        immediate: true,
      },
    },
    {
      field: 'name',
      label: '设备名称',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        maxlength: 20,
      },
    },
    {
      field: 'purchasePrice',
      label: '购买价格',
      component: 'InputNumber',
      colProps: { span: 12 },
      componentProps: {
        disabled: !hasEditPricePermission,
        controls: false,
        precision: 2,
      },
      renderComponentContent: () => {
        return {
          addonAfter: () => '元',
        };
      },
    },
    {
      field: 'deviceType',
      label: '设备种类',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: getDictOptions('DEVICE_TYPE'),
      },
    },
    {
      field: 'manufacturingDate',
      label: '出厂日期',
      component: 'DatePicker',
      colProps: { span: 12 },
      componentProps: {
        valueFormat: 'x',
      },
    },
    {
      field: 'organizationId',
      label: '所属部门',
      component: 'TreeSelect',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        showSearch: true,
        maxlength: 15,
        treeData: listToTreeAsParentId(getOrganizationsList!),
        dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
      },
    },
    {
      field: 'manufacturingNo',
      label: '出厂编号',
      component: 'Input',
      colProps: { span: 12 },
      componentProps: {
        maxlength: 20,
      },
    },
    {
      field: 'processId',
      label: '工艺系统',
      component: 'ApiTreeSelect',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        api: getProcessTree,
        showSearch: true,
        treeNodeFilterProp: 'name',
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        params: {
          forTree: true,
          orderBy: 'Code',
          ascending: true,
        },
        immediate: true,
      },
    },
    {
      field: 'setupDate',
      label: '投运日期',
      component: 'DatePicker',
      colProps: { span: 12 },
      componentProps: {
        valueFormat: 'x',
      },
    },
    {
      field: 'locationId',
      label: '设备位置',
      component: 'ApiTreeSelect',
      colProps: { span: 12 },
      componentProps: {
        mode: 'multiple',
        treeNodeFilterProp: 'name',
        treeCheckable: true,
        api: getLocationListApi,
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        immediate: true,
      },
    },
    {
      field: 'serviceLife',
      label: '使用年限',
      component: 'InputNumber',
      colProps: { span: 12 },
      componentProps: {
        controls: false,
        precision: 0,
        max: 1000000,
      },
      renderComponentContent: () => {
        return {
          addonAfter: () => '年',
        };
      },
    },
    {
      field: 'status',
      label: '设备状态',
      component: 'Select',
      colProps: { span: 12 },
      componentProps: {
        options: getDictOptions('DEVICE_STATUS'),
      },
    },
    {
      field: 'photoList',
      label: '设备照片',
      component: 'Upload',
      colProps: { span: 12 },
      componentProps: {
        api: uploadDevicesPhotoApi,
        maxNumber: 6,
        maxSize: 10,
        accept: ['images/*'],
        imageSize: {
          minWidth: 200,
          minHeight: 200,
        },
        previewTableColumns: [
          {
            dataIndex: 'url',
            title: t('component.upload.legend'),
            width: 100,
            customRender: ({ record }) => {
              return createVNode(Image, {
                src: `${apiUrl}/info/files/image/${record.fileId}?access_token=${token}`,
                width: 80,
              });
            },
          },
          {
            dataIndex: 'name',
            title: t('component.upload.fileName'),
          },
        ],
      },
    },
    {
      field: 'model',
      label: '型号',
      component: 'Input',
      colProps: { span: 12 },
      componentProps: {
        maxlength: 30,
      },
    },
    {
      field: 'cameraIds',
      label: '摄像头',
      component: 'ApiSelect',
      colProps: { span: 12 },
      componentProps: {
        optionFilterProp: 'label',
        showSearch: true,
        api: getCamerasListApi,
        params: {
          orderBy: '',
          ascending: true,
          pageSize: 0,
          pageNo: 0,
        },
        resultField: 'items',
        valueField: 'id',
        immediate: true,
        onOptionsReady: (options) => {
          options.map((v) => {
            v.label = v.cameraName + ' ' + (v.location || ''); // 重组 name 字段，用于显示
          });
          return options;
        },
      },
    },
    {
      field: 'categoryId',
      label: '设备类型',
      component: 'ApiSelect',
      colProps: { span: 12 },
      componentProps: ({ formModel }) => {
        return {
          showSearch: true,
          api: getDevicesCategoryListApi,
          params: { isPrimary: null },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: true,
          optionFilterProp: 'label',
          onOptionsReady: (options) => {
            categoryList.value = options || [];
          },
          onChange: (id: number) => {
            const selectedCategory = categoryList.value.find((v) => v.id === id);

            const specDataList = unref(selectedCategory).specDataList.map((v) => ({
              extraDisplayMode: v.extraDisplayMode,
              specDataId: v.id,
              unit: v.unit,
              name: v.name,
              value: '',
            }));
            console.log(specDataList);

            formModel['specDataList'] = ref(specDataList);
          },
        };
      },
    },
    {
      field: 'memo',
      label: '备注信息',
      component: 'InputTextArea',
      colProps: { span: 12 },
      componentProps: {
        showCount: true,
        maxlength: 100,
        autoSize: {
          minRows: 2,
          maxRows: 5,
        },
      },
    },
    {
      field: 'specDataList',
      label: '设备规格',
      helpMessage: '请先准确选择设备类型',
      component: 'Select',
      colProps: { span: 12 },
      slot: 'specDataList',
    },
  ];
};

import { BackModeRouteRecordRaw } from '/@/router/types';

const demo: BackModeRouteRecordRaw = {
  path: '/demo',
  name: 'Demo',
  component: 'LAYOUT',
  redirect: '/demo/comp/basic',
  meta: {
    code: 17000,
    icon: 'ion:layers-outline',
    title: 'routes.demo.title',
  },
  children: [
    {
      path: 'comp',
      name: 'comp',
      component: 'LAYOUT',
      redirect: '/comp/basic',
      meta: {
        code: 27500,
        icon: 'ion:layers-outline',
        title: 'routes.demo.comp.comp',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicDemo',
          component: '/demo/comp/button/index',
          meta: {
            code: 27500,
            title: 'routes.demo.comp.basic',
          },
        },
        {
          path: 'drag-panel',
          name: 'DragPanel',
          component: '/demo/comp/dragPanel/index',
          meta: {
            code: 27500,
            title: 'routes.demo.comp.dragPanel',
          },
        },
        {
          path: 'form',
          name: 'FormDemo',
          redirect: '/comp/form/basic',
          component: 'LAYOUT',
          meta: {
            code: 27500,
            icon: 'mdi:form-select',
            title: 'routes.demo.form.form',
          },
          children: [
            {
              path: 'basic',
              name: 'FormBasicDemo',
              component: '/demo/form/index',
              meta: {
                code: 27500,
                title: 'routes.demo.form.basic',
              },
            },
            {
              path: 'useForm',
              name: 'UseFormDemo',
              component: '/demo/form/UseForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.useForm',
              },
            },
            {
              path: 'refForm',
              name: 'RefFormDemo',
              component: '/demo/form/RefForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.refForm',
              },
            },
            {
              path: 'advancedForm',
              name: 'AdvancedFormDemo',
              component: '/demo/form/AdvancedForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.advancedForm',
              },
            },
            {
              path: 'ruleForm',
              name: 'RuleFormDemo',
              component: '/demo/form/RuleForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.ruleForm',
              },
            },
            {
              path: 'dynamicForm',
              name: 'DynamicFormDemo',
              component: '/demo/form/DynamicForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.dynamicForm',
              },
            },
            {
              path: 'customerForm',
              name: 'CustomerFormDemo',
              component: '/demo/form/CustomerForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.customerForm',
              },
            },
            {
              path: 'appendForm',
              name: 'appendFormDemo',
              component: '/demo/form/AppendForm',
              meta: {
                code: 27500,
                title: 'routes.demo.form.appendForm',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'charts',
      name: 'Charts',
      component: 'LAYOUT',
      redirect: '/charts/echarts/map',
      meta: {
        code: 27500,
        orderNo: 500,
        icon: 'ion:bar-chart-outline',
        title: 'routes.demo.charts.charts',
      },
      children: [
        {
          path: 'baiduMap',
          name: 'BaiduMap',
          meta: {
            code: 27500,
            title: 'routes.demo.charts.baiduMap',
          },
          component: '/demo/charts/map/Baidu',
        },
        {
          path: 'aMap',
          name: 'AMap',
          meta: {
            code: 27500,
            title: 'routes.demo.charts.aMap',
          },
          component: '/demo/charts/map/Gaode',
        },
        {
          path: 'googleMap',
          name: 'GoogleMap',
          meta: {
            code: 27500,
            title: 'routes.demo.charts.googleMap',
          },
          component: '/demo/charts/map/Google',
        },
        {
          path: 'echarts',
          name: 'Echarts',
          component: 'LAYOUT',
          meta: {
            code: 27500,
            title: 'Echarts',
          },
          redirect: '/charts/echarts/map',
          children: [
            {
              path: 'map',
              name: 'Map',
              component: '/demo/charts/Map',
              meta: {
                code: 27500,
                title: 'routes.demo.charts.map',
              },
            },
            {
              path: 'line',
              name: 'Line',
              component: '/demo/charts/Line',
              meta: {
                code: 27500,
                title: 'routes.demo.charts.line',
              },
            },
            {
              path: 'pie',
              name: 'Pie',
              component: '/demo/charts/Pie',
              meta: {
                code: 27500,
                title: 'routes.demo.charts.pie',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default demo;

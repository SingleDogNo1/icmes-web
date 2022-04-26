import { mount } from '@vue/test-utils';
import HelloWorld from '/@/components/HelloWorld.vue';

describe('HelloWorld 组件', () => {
  it('测试 props 绑定', () => {
    const msg = 'Hello Vue 3';
    const wrapper = mount(HelloWorld, { props: { msg } });
    expect(wrapper.find('h1').text()).toEqual(msg);
  });
});

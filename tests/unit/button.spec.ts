import { mount } from '@vue/test-utils';
import HelloWorld from '/@/components/Button/src/BasicButton.vue';

// TODO vite 中使用 jest，import.meta.env 报错，暂时没有解决方法
describe('button 组件', () => {
  it('button 组件插值', () => {
    const msg = 'button';
    const wrapper = mount(HelloWorld, { slots: { default: msg } });

    expect(wrapper.text()).toContain(msg);
  });
});

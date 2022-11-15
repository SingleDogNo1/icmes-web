import { expect, describe, it } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from '/@/components/Button/src/BasicButton.vue';

describe('button 组件', () => {
  it('button 组件插值', () => {
    const msg = 'button';
    const wrapper = mount(HelloWorld, { slots: { default: msg } });

    expect(wrapper.text()).toContain(msg);
  });
});

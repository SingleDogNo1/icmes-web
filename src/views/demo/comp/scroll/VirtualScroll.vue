<template>
  <PageWrapper contentFullHeight fixedHeight class="virtual-scroll-demo">
    <div ref="demoWrapper" class="h-full grid grid-cols-2 grid-rows-2 gap-4">
      <div class="bg-white relative">
        <a-button type="primary" class="!absolute z-20 top-5 right-5">基础用法</a-button>
        <VScroll
          :data="data"
          :width="wrapperWidth / 2"
          :height="wrapperHeight / 2"
          :itemSize="50"
          v-slot="{ item, index }"
        >
          <div class="list-item h-full px-5 leading-50px border-b border-gray-200">
            {{ index + 1 }} : {{ item.title }}
          </div>
        </VScroll>
      </div>

      <div class="bg-white relative">
        <a-button type="primary" class="!absolute z-20 bottom-5 right-5"> 横向滚动 </a-button>
        <VScroll
          :data="data"
          :width="wrapperWidth / 2"
          :height="wrapperHeight / 2"
          :itemSize="120"
          scrollDirection="horizontal"
          v-slot="{ item, index }"
        >
          <div class="list-item h-full px-5 leading-50px border-r border-gray-200">
            {{ index + 1 }}
            <br />
            {{ item.title }}
          </div>
        </VScroll>
      </div>

      <div class="bg-white relative">
        <a-button type="primary" class="!absolute z-20 top-5 right-5">自定义高度</a-button>
        <VScroll
          :data="data"
          :width="wrapperWidth / 2"
          :height="wrapperHeight / 2"
          :itemSize="getItemSize"
          v-slot="{ item, index }"
        >
          <div class="list-item h-full px-5 leading-50px border-b border-gray-100">
            {{ index + 1 }} : {{ item.title }}
          </div>
        </VScroll>
      </div>

      <div class="bg-white relative">
        <div class="!absolute z-20 top-5 right-5">
          <InputNumber v-model:value="scrollToIndex" :min="0" />

          <Select v-model:value="scrollToAlignment" class="w-40 !mx-4">
            <Select.Option value="auto">auto</Select.Option>
            <Select.Option value="start">start</Select.Option>
            <Select.Option value="center">center</Select.Option>
            <Select.Option value="end">end</Select.Option>
          </Select>

          <InputNumber v-model:value="scrollOffset" :min="0" />

          <a-button type="primary" class="ml-4">控制滚动</a-button>
        </div>
        <VScroll
          :data="data"
          :width="wrapperWidth / 2"
          :height="wrapperHeight / 2"
          :itemSize="getItemSize"
          :scrollToIndex="scrollToIndex"
          :scrollToAlignment="scrollToAlignment"
          :scrollOffset="scrollOffset"
          v-slot="{ item, index }"
        >
          <div
            class="list-item h-full px-5 leading-50px border-b border-gray-100"
            :class="{ 'bg-gray-100': index === scrollToIndex }"
          >
            {{ index + 1 }} : {{ item.title }}
          </div>
        </VScroll>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  export default {
    name: 'VScrollDemo',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { InputNumber, Select } from 'ant-design-vue';
  import { VScroll } from '/@/components/VirtualScroll';
  import { PageWrapper } from '/@/components/Page';
  import { useElementSize } from '@vueuse/core';

  const data = (() => {
    const arr: Recordable[] = [];
    for (let index = 0; index < 100000; index++) {
      arr.push({
        title: '列表项' + (index + 1),
      });
    }
    return arr;
  })();
  const demoWrapper = ref(null);
  const scrollToIndex = ref(0);
  const scrollOffset = ref(0);
  const scrollToAlignment = ref<'auto' | 'start' | 'center' | 'end'>('auto');
  const { width: wrapperWidth, height: wrapperHeight } = useElementSize(demoWrapper);

  function getItemSize(i: number) {
    switch (i % 4) {
      case 1:
        return 50;
      case 2:
        return 100;
      case 3:
        return 150;
      default:
        return 200;
    }
  }
</script>

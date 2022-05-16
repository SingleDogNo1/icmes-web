<!--
  // INFO
  本页引用了由本人基于[vue-grid-layout](https://github.com/jbaysolutions/vue-grid-layout)亲手重构的插件，api 与原插件保持一致
  演示时可能会有卡顿、延迟等现象均属正常，因为演示所有的功能，触发了大量的 vue 警告和堆栈信息
  在正常的业务中通常只会用到某一部分功能，并不会导致卡顿现象
-->
<template>
  <a-button class="mr-2.5" @click="decreaseWidth"> 减小宽度 </a-button>
  <a-button class="mr-2.5" @click="increaseWidth">增加宽度</a-button>
  <a-button class="mr-2.5" @click="addItem">插入节点</a-button>
  <a-button class="mr-2.5" @click="addItemDynamically">动态插入节点</a-button>
  <Checkbox v-model:checked="draggable">拖动</Checkbox>
  <Checkbox v-model:checked="resizable">调整大小</Checkbox>
  <Checkbox v-model:checked="mirrored">镜像节点</Checkbox>
  <Checkbox v-model:checked="responsive">Responsive</Checkbox>
  <Checkbox v-model:checked="preventCollision">防止碰撞</Checkbox>
  <div class="my-2.5 flex">
    <div class="mr-2.5">单位高度: <InputNumber v-model:value="rowHeight" :min="30" /></div>
    <div class="mr-2.5">行数: <InputNumber v-model:value="colNum" :min="1" /></div>
    <div class="mr-2.5">水平间距: <InputNumber v-model:value="marginX" :min="1" /></div>
    <div class="mr-2.5">垂直间距: <InputNumber v-model:value="marginY" :min="1" /></div>
  </div>
  <div id="content">
    <GridLayout
      ref="gridLayoutRef"
      v-model:layout="layout"
      :col-num="colNum"
      :row-height="rowHeight"
      :prevent-collision="preventCollision"
      :is-draggable="draggable"
      :is-resizable="resizable"
      :is-mirrored="mirrored"
      :responsive="responsive"
      :vertical-compact="true"
      :margin="[marginX, marginY]"
      :use-css-transforms="true"
      @breakpoint-changed="breakpointChangedEvent"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        drag-allow-from=".toolbox"
        v-bind="item"
        @resize="handleResize"
        @move="move"
        @resized="resized"
        @container-resized="containerResized"
        @moved="moved"
      >
        <div class="flex flex-col h-full">
          <div class="toolbox h-10 leading-10 text-center bg-primary bg-opacity-60 text-white">
            drag
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            :class="item.static ? 'bg-disabled' : 'bg-white'"
          >
            {{ item.i }}
          </div>
        </div>
      </GridItem>
    </GridLayout>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'VueGridLAyoutDemo',
  };
</script>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { GridLayout, GridItem } from 'grid-layout-vue3';
  import 'grid-layout-vue3/dist/style.css';
  import type { Layout } from 'grid-layout-vue3/src/packages/GridLayout/types';
  import { Checkbox, InputNumber } from 'ant-design-vue';

  const gridLayoutRef = ref(null);
  const layout = ref<Layout>([
    { x: 0, y: 0, w: 2, h: 3, i: '0', static: false, minH: 2 },
    { x: 2, y: 0, w: 2, h: 4, i: '1', static: true },
    { x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
    { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
    { x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
    { x: 10, y: 0, w: 2, h: 3, i: '5', static: false },
    { x: 0, y: 5, w: 2, h: 5, i: '6', static: false },
    { x: 2, y: 5, w: 2, h: 5, i: '7', static: false },
    { x: 4, y: 5, w: 2, h: 5, i: '8', static: false },
    { x: 6, y: 3, w: 2, h: 4, i: '9', static: true },
  ]);
  const index = ref(0);
  const colNum = ref(12);
  const draggable = ref(true);
  const resizable = ref(true);
  const mirrored = ref(false);
  const responsive = ref(true);
  const preventCollision = ref(false);
  const rowHeight = ref(40);
  const marginX = ref(10);
  const marginY = ref(10);

  onMounted(() => {
    index.value = layout.value.length;
  });

  function increaseWidth() {
    let width = document.getElementById('content')?.offsetWidth;
    width! += 20;
    (document.getElementById('content') as HTMLElement).style.width = width! + 'px';
  }

  function decreaseWidth() {
    let width = document.getElementById('content')?.offsetWidth;
    width! -= 20;
    (document.getElementById('content') as HTMLElement).style.width = width + 'px';
  }

  function addItem() {
    let item = { x: 0, y: 0, w: 2, h: 2, i: index.value + '' };
    index.value++;
    layout.value.push(item);
  }

  function addItemDynamically() {
    const x = (layout.value.length * 2) % (colNum.value || 12);
    const y = layout.value.length + (colNum.value || 12);
    let item = {
      x: x,
      y: y,
      w: 2,
      h: 2,
      i: index.value + '',
    };
    index.value++;
    layout.value.push(item);
  }

  function breakpointChangedEvent(newBreakpoint, newLayout) {
    console.log('breakpoint changed breakpoint=', newBreakpoint, ', layout: ', newLayout);
  }

  function handleResize(i, newH, newW, newHPx, newWPx) {
    console.log(`RESIZE i= ${i}, H= ${newH}, W= ${newW}, H(px)= ${newHPx}, W(px)= ${newWPx}`);
  }

  function move(i, newX, newY) {
    console.log(`MOVE i= ${i}, X= ${newX}, Y= ${newY}`);
  }

  function moved(i, newX, newY) {
    console.log(`MOVED i= ${i}, X= ${newX}, Y=${newY}`);
  }
  function resized(i, newH, newW, newHPx, newWPx) {
    console.log(` RESIZED i= ${i}, H= ${newH}, W= ${newW}, H(px)= ${newHPx}, W(px)= ${newWPx}`);
  }
  function containerResized(i, newH, newW, newHPx, newWPx) {
    console.log(
      `CONTAINER RESIZED i= ${i}, H= ${newH}, W= ${newW}, H(px)= ${newHPx}, W(px)= ${newWPx}`,
    );
  }

  console.log('object :>> ', gridLayoutRef.value);
</script>

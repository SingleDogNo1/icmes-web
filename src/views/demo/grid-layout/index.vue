<template>
  <div class="layoutJSON">
    Displayed as <code>[x, y, w, h]</code>:
    <div class="columns">
      <div class="layoutItem" v-for="item in layout" :key="item.i">
        <b>{{ item.i }}</b
        >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
      </div>
    </div>
  </div>
  <div class="mt-2.5">
    <a-button class="mr-2.5" @click="decreaseWidth"> 减小宽度 </a-button>
    <a-button class="mr-2.5" @click="increaseWidth">增加宽度</a-button>
    <a-button class="mr-2.5" @click="addItem">插入节点</a-button>
    <a-button class="mr-2.5" @click="addItemDynamically">动态插入节点</a-button>
    <a-button class="mr-2.5" @click="changeDirection">反向</a-button>
    <Checkbox v-model:checked="draggable">拖动</Checkbox>
    <Checkbox v-model:checked="resizable">调整大小</Checkbox>
    <Checkbox v-model:checked="mirrored">镜像节点</Checkbox>
    <Checkbox v-model:checked="responsive">Responsive</Checkbox>
    <Checkbox v-model:checked="preventCollision">防止碰撞</Checkbox>
    <div class="my-2.5 flex">
      <div class="mr-2.5">单位高度: <InputNumber v-model:value="rowHeight" :min="1" /></div>
      <div class="mr-2.5">行数: <InputNumber v-model:value="colNum" :min="1" /></div>
      <div class="mr-2.5">水平间距: <InputNumber v-model:value="marginX" :min="1" /></div>
      <div class="mr-2.5">垂直间距: <InputNumber v-model:value="marginY" :min="1" /></div>
    </div>
    <GridLayout
      :margin="[parseInt(marginX), parseInt(marginY)]"
      v-model:layout="layout"
      :col-num="parseInt(colNum)"
      :row-height="rowHeight"
      :is-draggable="draggable"
      :is-resizable="resizable"
      :is-mirrored="mirrored"
      :prevent-collision="preventCollision"
      :vertical-compact="compact"
      :use-css-transforms="true"
      :responsive="responsive"
      @layout-created="layoutCreatedEvent"
      @layout-before-mount="layoutBeforeMountEvent"
      @layout-mounted="layoutMountedEvent"
      @layout-ready="layoutReadyEvent"
      @layout-updated="layoutUpdatedEvent"
      @breakpoint-changed="breakpointChangedEvent"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW"
        :max-w="item.maxW"
        :min-h="item.minH"
        :max-h="item.maxH"
        @resize="resize"
        @move="move"
        @resized="resized"
        @container-resized="containerResized"
        @moved="moved"
      >
        <span @click="removeItem(item.i)">{{ item.i }}</span>
      </GridItem>
    </GridLayout>
    <hr />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { GridLayout, GridItem } from '/@/components/GridLayout';
  import { Checkbox, InputNumber } from 'ant-design-vue';
  import { getDocumentDir, setDocumentDir } from '/@/components/GridLayout/src/helper/DOM';
  import { Layout } from '/@/components/GridLayout/src/typing';
  let testLayout: Layout = [
    { x: 0, y: 0, w: 2, h: 3, i: '0', static: false, minH: 3, maxH: 5 },
    { x: 2, y: 0, w: 2, h: 4, i: '1', static: true },
    { x: 4, y: 0, w: 2, h: 5, i: '2', static: false, minH: 4, maxH: 4, minW: 2, maxW: 2 },
    { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
    { x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
    { x: 10, y: 0, w: 2, h: 3, i: '5', static: false },
    { x: 0, y: 5, w: 2, h: 5, i: '6', static: false },
    { x: 2, y: 5, w: 2, h: 5, i: '7', static: false },
    { x: 4, y: 5, w: 2, h: 5, i: '8', static: false },
    { x: 6, y: 3, w: 2, h: 4, i: '9', static: true },
    { x: 8, y: 4, w: 2, h: 4, i: '10', static: false },
    { x: 10, y: 4, w: 2, h: 4, i: '11', static: false, minH: 4 },
    { x: 0, y: 10, w: 2, h: 5, i: '12', static: false },
    { x: 2, y: 10, w: 2, h: 5, i: '13', static: false },
    { x: 4, y: 8, w: 2, h: 4, i: '14', static: false },
    { x: 6, y: 8, w: 2, h: 4, i: '15', static: false },
    { x: 8, y: 10, w: 2, h: 5, i: '16', static: false },
    { x: 10, y: 4, w: 2, h: 2, i: '17', static: false },
    { x: 0, y: 9, w: 2, h: 3, i: '18', static: false },
    { x: 2, y: 6, w: 2, h: 2, i: '19', static: false },
  ];

  const layout = ref(testLayout);
  const draggable = ref(true);
  const resizable = ref(true);
  const mirrored = ref(false);
  const responsive = ref(true);
  const preventCollision = ref(false);
  const compact = ref(true);
  const rowHeight = ref(30);
  const colNum = ref(12);
  const index = ref(0);
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

  function removeItem(i) {
    const index = layout.value.map((item) => item.i).indexOf(i);
    console.log('i :>> ', i, index);

    layout.value.splice(index, 1);
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

  function move(i, newX, newY) {
    console.log(`MOVE i= ${i}, X= ${newX}, Y= ${newY}`);
  }

  function resize(i, newH, newW, newHPx, newWPx) {
    console.log(`RESIZE i= ${i}, H= ${newH}, W= ${newW}', H(px)= ${newHPx}, W(px)= ${newWPx}`);
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

  /** Add change direction button */
  function changeDirection() {
    let documentDirection = getDocumentDir();
    let toggle = '';
    if (documentDirection === 'rtl') {
      toggle = 'ltr';
    } else {
      toggle = 'rtl';
    }
    setDocumentDir(toggle);
  }

  function layoutCreatedEvent(newLayout) {
    console.log('Created layout: ', newLayout);
  }
  function layoutBeforeMountEvent(newLayout) {
    console.log('beforeMount layout: ', newLayout);
  }
  function layoutMountedEvent(newLayout) {
    console.log('Mounted layout: ', newLayout);
  }
  function layoutReadyEvent(newLayout) {
    console.log('Ready layout: ', newLayout);
  }
  function layoutUpdatedEvent(newLayout) {
    console.log('Updated layout: ', newLayout);
  }
  function breakpointChangedEvent(newBreakpoint, newLayout) {
    console.log('breakpoint changed breakpoint=', newBreakpoint, ', layout: ', newLayout);
  }
</script>
<style scoped>
  .layoutJSON {
    background: #ddd;
    padding: 10px;
  }

  .columns {
    columns: 120px;
  }
</style>

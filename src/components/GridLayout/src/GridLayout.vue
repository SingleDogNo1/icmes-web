<template>
  <div ref="itemRef" class="vue-grid-layout" :style="mergedStyle">
    <slot></slot>
    <GridItem
      class="vue-grid-placeholder"
      v-show="isDragging"
      :x="placeholder.x"
      :y="placeholder.y"
      :w="placeholder.w"
      :h="placeholder.h"
      :i="placeholder.i"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'GridLayout',
  };
</script>

<script lang="ts" setup>
  import {
    ref,
    provide,
    reactive,
    onBeforeUnmount,
    onBeforeMount,
    onMounted,
    nextTick,
    watch,
  } from 'vue';
  import mitt from 'mitt';
  import elementResizeDetectorMaker from 'element-resize-detector';

  import {
    bottom,
    cloneLayout,
    compact,
    getAllCollisions,
    getLayoutItem,
    moveElement,
    validateLayout,
  } from './helper/utils';
  import { Layout } from './typing';
  import {
    findOrGenerateResponsiveLayout,
    getBreakpointFromWidth,
    getColsFromBreakpoint,
  } from './helper/responsiveUtils';
  import GridItem from './GridItem.vue';
  import { addWindowEventListener, removeWindowEventListener } from './helper/DOM';
  import { layoutProps } from './props';

  const props = defineProps(layoutProps);

  const emit = defineEmits([
    'layout-created',
    'layout-before-mount',
    'layout-mounted',
    'layout-updated',
    'breakpoint-changed',
    'update:layout',
    'layout-ready',
  ]);

  const eventBus = mitt();
  provide('eventBus', eventBus);
  provide('$parent', props);

  const width = ref<number | null>(null);
  const mergedStyle = ref<{ [index: string]: string }>({});
  const lastLayoutLength = ref(0);
  const isDragging = ref(false);
  const placeholder = reactive({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    i: -1,
  });

  const layouts = ref<{ [index: string]: any }>({}); // array to store all layouts from different breakpoints
  const lastBreakpoint = ref<string | null>(null); // store last active breakpoint
  const originalLayout = ref<Layout | null>(null); // store original Layout
  const erd = ref<any>();
  const itemRef = ref();

  const resizeEventHandler = ({ eventType, i, x, y, h, w }) => {
    resizeEvent(eventType, i, x, y, h, w);
  };

  const dragEventHandler = ({ eventType, i, x, y, h, w }) => {
    dragEvent(eventType, i, x, y, h, w);
  };

  eventBus.on('resizeEvent', resizeEventHandler);
  eventBus.on('dragEvent', dragEventHandler);
  emit('layout-created', props.layout);

  onBeforeUnmount(() => {
    eventBus.off('resizeEvent', resizeEventHandler);
    eventBus.off('dragEvent', dragEventHandler);
    removeWindowEventListener('resize', onWindowResize);
    erd.value.uninstall(itemRef.value);
  });

  onBeforeMount(() => {
    emit('layout-before-mount', props.layout);
  });

  onMounted(() => {
    emit('layout-mounted', props.layout);
    nextTick(() => {
      validateLayout(props.layout!);

      originalLayout.value = props.layout!;

      nextTick(() => {
        onWindowResize();

        initResponsiveFeatures();

        addWindowEventListener('resize', onWindowResize);

        compact(props.layout!, props.verticalCompact);

        emit('layout-updated', props.layout);

        updateHeight();
        nextTick(() => {
          erd.value = elementResizeDetectorMaker({
            strategy: 'scroll',
            callOnAdd: false,
          });
          erd.value.listenTo(itemRef.value, function () {
            onWindowResize();
          });
        });
      });
    });
  });

  function layoutUpdate() {
    if (props.layout !== undefined && originalLayout.value !== null) {
      if (props.layout.length !== originalLayout.value.length) {
        let diff = findDifference(props.layout, originalLayout.value);
        if (diff.length > 0) {
          if (props.layout.length > originalLayout.value.length) {
            originalLayout.value = [...originalLayout.value, ...diff];
          } else {
            originalLayout.value = originalLayout.value.filter((obj) => {
              return !diff.some((obj2) => obj.i === obj2.i);
            });
          }
        }

        lastLayoutLength.value = props.layout.length;
        initResponsiveFeatures();
      }

      updateHeight();

      eventBus.emit('updateWidth', width.value);
      emit('layout-updated', props.layout);
      compact(props.layout!, props.verticalCompact!);
    }
  }

  function updateHeight() {
    mergedStyle.value = {
      height: containerHeight()!,
    };
  }

  function containerHeight() {
    if (!props.autoSize) return;
    return bottom(props.layout!) * (props.rowHeight + props.margin[1]) + props.margin[1] + 'px';
  }

  function onWindowResize() {
    if (itemRef.value) {
      width.value = itemRef.value.offsetWidth;
    }
    eventBus.emit('resizeEvent', {});
  }

  function dragEvent(eventName, id, x, y, h, w) {
    let l = getLayoutItem(props.layout!, id);
    if (l === undefined || l === null) {
      l = { x: 0, y: 0 };
    }

    if (eventName === 'dragmove' || eventName === 'dragstart') {
      placeholder.i = id;
      placeholder.x = l.x!;
      placeholder.y = l.y!;
      placeholder.w = w;
      placeholder.h = h;
      nextTick(() => {
        isDragging.value = true;
      });
      eventBus.emit('updateWidth', width.value);
    } else {
      nextTick(() => {
        isDragging.value = false;
      });
    }

    // Move the element to the dragged location.
    moveElement(props.layout!, l, x, y, true, props.preventCollision);
    compact(props.layout!, props.verticalCompact);
    // needed because vue can't detect changes on array element properties
    eventBus.emit('compact');
    updateHeight();
    if (eventName === 'dragend') emit('layout-updated', props.layout);
  }

  function resizeEvent(eventName, id, x, y, h, w) {
    let l = getLayoutItem(props.layout!, id);
    if (l === undefined || l === null) {
      l = { h: 0, w: 0 };
    }

    let hasCollisions;
    if (props.preventCollision) {
      const collisions = getAllCollisions(props.layout!, { ...l, w, h }).filter(
        (layoutItem) => layoutItem.i !== l?.i,
      );
      hasCollisions = collisions.length > 0;

      if (hasCollisions) {
        let leastX = Infinity,
          leastY = Infinity;
        collisions.forEach((layoutItem) => {
          if (layoutItem.x! > (l?.x as number)) leastX = Math.min(leastX, layoutItem.x!);
          if (layoutItem.y! > (l?.y as number)) leastY = Math.min(leastY, layoutItem.y!);
        });

        if (Number.isFinite(leastX)) l.w = leastX - l.x!;
        if (Number.isFinite(leastY)) l.h = leastY - l.y!;
      }
    }

    if (!hasCollisions) {
      l.w = w;
      l.h = h;
    }

    if (eventName === 'resizestart' || eventName === 'resizemove') {
      placeholder.i = id;
      placeholder.x = x;
      placeholder.y = y;
      placeholder.w = l.w!;
      placeholder.h = l.h!;
      nextTick(() => {
        isDragging.value = true;
      });
      eventBus.emit('updateWidth', width.value);
    } else {
      nextTick(() => {
        isDragging.value = false;
      });
    }

    if (props.responsive) responsiveGridLayout();

    compact(props.layout!, props.verticalCompact);
    eventBus.emit('compact');
    updateHeight();

    if (eventName === 'resizeend') emit('layout-updated', props.layout);
  }

  // finds or generates new layouts for set breakpoints
  function responsiveGridLayout() {
    let newBreakpoint = getBreakpointFromWidth(props.breakpoints, width.value);
    let newCols = getColsFromBreakpoint(newBreakpoint, props.cols);

    if (lastBreakpoint.value != null && !layouts.value[lastBreakpoint.value])
      layouts.value[lastBreakpoint.value] = cloneLayout(props.layout!);

    let layout = findOrGenerateResponsiveLayout(
      originalLayout.value,
      layouts.value,
      props.breakpoints,
      newBreakpoint,
      lastBreakpoint.value,
      newCols,
      props.verticalCompact,
    );

    layouts.value[newBreakpoint] = layout;

    if (lastBreakpoint.value !== newBreakpoint) {
      emit('breakpoint-changed', newBreakpoint, layout);
    }

    // new prop sync
    emit('update:layout', layout);

    lastBreakpoint.value = newBreakpoint;
    eventBus.emit('setColNum', getColsFromBreakpoint(newBreakpoint, props.cols));
  }

  // clear all responsive layouts
  function initResponsiveFeatures() {
    // clear layouts
    layouts.value = Object.assign({}, props.responsiveLayouts);
  }

  // find difference in layouts
  function findDifference(layout, originalLayout) {
    //Find values that are in result1 but not in result2
    let uniqueResultOne = layout.filter(function (obj) {
      return !originalLayout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    //Find values that are in result2 but not in result1
    let uniqueResultTwo = originalLayout.filter(function (obj) {
      return !layout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    //Combine the two arrays of unique entries#
    return uniqueResultOne.concat(uniqueResultTwo);
  }

  watch(
    () => width.value,
    (val, oldVal) => {
      nextTick(() => {
        eventBus.emit('updateWidth', val);
        if (oldVal === null) {
          nextTick(() => {
            emit('layout-ready', props.layout);
          });
        }
        updateHeight();
      });
    },
  );

  watch(
    () => props.layout,
    () => {
      layoutUpdate();
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.colNum,
    (val) => {
      eventBus.emit('setColNum', val);
    },
  );

  watch(
    () => props.rowHeight,
    (val) => {
      eventBus.emit('setRowHeight', val);
    },
  );

  watch(
    () => props.isDraggable,
    (val) => {
      eventBus.emit('setDraggable', val);
    },
  );

  watch(
    () => props.isResizable,
    (val) => {
      eventBus.emit('setResizable', val);
    },
  );

  watch(
    () => props.responsive,
    (val) => {
      if (!val) {
        emit('update:layout', originalLayout.value);
        eventBus.emit('setColNum', props.colNum);
      }
      onWindowResize();
    },
  );

  watch(
    () => props.maxRows,
    (val) => {
      eventBus.emit('setMaxRows', val);
    },
  );

  watch(
    () => props.margin,
    () => {
      updateHeight();
    },
    {
      deep: true,
    },
  );
</script>

<style scoped>
  .vue-grid-layout {
    position: relative;
    transition: height 200ms ease;
  }
</style>

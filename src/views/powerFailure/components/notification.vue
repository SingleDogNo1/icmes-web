<template>
  <ul ref="notificationRef" :class="[prefixCls]" :style="style" v-if="data && visible">
    <li
      v-for="item in cardsList"
      :key="item.key"
      :class="['card-item', item.key]"
      @click="handleClickCardItem(item)"
    >
      <template v-if="item.show">
        <Tooltip :title="item.tooltip" placement="bottom">
          <div class="item-header">
            <header> {{ item.count }}</header>
            <p v-html="item.title"></p>
          </div>
        </Tooltip>
        <Tooltip :title="item.subTooltip" placement="bottom">
          <footer> {{ item.subtitle }}{{ item.subCount }}</footer>
        </Tooltip>
      </template>
    </li>
    <li class="close" @click="visible = false">
      <Icon icon="ei:close" :size="18" />
    </li>
  </ul>
</template>

<script lang="ts">
  export default {
    name: 'PowerFailureNotificationComp',
  };
</script>

<script lang="ts" setup>
  import { ref, unref, PropType, watch } from 'vue';
  import { useDraggable, useWindowSize } from '@vueuse/core';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Tooltip } from 'ant-design-vue';
  import { isNil } from 'lodash-es';
  import { Icon } from '/@/components/Icon';

  const props = defineProps({
    data: {
      type: Object as PropType<{ [index: string]: number }>,
      required: true,
    },
  });

  const emit = defineEmits(['choose']);

  const hasCount = (key) => !isNil(key);

  const visible = ref(true);

  const cardsList = ref<any[]>([]);

  const { prefixCls } = useDesign('power-failure-notification');
  const notificationRef = ref<HTMLElement | null>(null);
  const { getMenuWidth: menuWidth } = useMenuSetting();

  const { width: windowWidth } = useWindowSize();

  const { x, y, style } = useDraggable(notificationRef, {
    /*
      // TODO
      初始位置设定: x 方向位置有其他更好的办法吗?
      屏幕宽度减去菜单宽度, 得到内容容器宽度.
      内容容器中 form 平分四份,而且最后一行余两个参数的情况下, 要想默认不遮挡表单控件
      得到 x 方向位置应该等于 菜单宽度 + 内容宽度的一半, 高度不用计算,可以写死
    */
    initialValue: { x: menuWidth.value + (windowWidth.value - menuWidth.value) / 2, y: 160 },
    onStart: () => {
      (document.querySelector('body') as HTMLElement).style.userSelect = 'none';
    },
    onMove: () => {
      const layout = document.querySelector('.icmes-layout-content');
      const current = unref(notificationRef);
      const {
        x: layoutX,
        y: layoutY,
        width: layoutW,
        height: layoutH,
      } = layout?.getBoundingClientRect() as DOMRect;
      const { width: currentW, height: currentH } = current?.getBoundingClientRect() as DOMRect;

      if (x.value <= layoutX) {
        x.value = layoutX;
      }
      if (x.value >= layoutW + layoutX - currentW) {
        x.value = layoutW + layoutX - currentW;
      }
      if (y.value <= layoutY) {
        y.value = layoutY;
      }
      if (y.value >= layoutH + layoutY - currentH) {
        y.value = layoutH + layoutY - currentH;
      }
    },
    onEnd: () => {
      (document.querySelector('body') as HTMLElement).style.userSelect = '';
    },
  });

  watch(
    () => props.data,
    (val) => {
      cardsList.value = [
        {
          key: 'wait-confirm',
          show: hasCount(val.waitConfirmCount) || hasCount(val.alreadyConfirmCount),
          title: '待调度确认',
          subtitle: '已确认',
          tooltip: '当前停送电单中需要调度确认的单数。',
          subTooltip: '当日停送电单中调度已经确认的单数。',
          count: val.waitConfirmCount || 0,
          subCount: val.alreadyConfirmCount || 0,
        },
        {
          key: 'wait-dispatch-test',
          show: hasCount(val.waitConfirmTestCount) || hasCount(val.alreadyConfirmTestCount),
          title: '待调度确认<br />(试车)',
          subtitle: '已确认',
          tooltip: `当前停送电单中需要调度确认的试车流程的单数。其中包含“送电试车”和“试车结束再停电”两种情况。`,
          subTooltip: '当日停送电单中调度已经确认过试车的单数。',
          count: val.waitConfirmTestCount || 0,
          subCount: val.alreadyConfirmTestCount || 0,
        },
        {
          key: 'wait-dispatch',
          show: hasCount(val.waitConfirmCompleteCount) || hasCount(val.alreadyConfirmCompleteCount),
          title: '待调度确认<br />(流程结束)',
          subtitle: '已确认',
          tooltip: `当前停送电单中，已经完成了检修，需要调度确认流程结束的单数。其中非常规设备（行车、电动葫芦）确认后会送电`,
          subTooltip: '当日停送电单中调度已经确认过流程结束的单数。',
          count: val.waitConfirmCompleteCount || 0,
          subCount: val.alreadyConfirmCompleteCount || 0,
        },
        {
          key: 'remote-error',
          show: hasCount(val.waitConfirmCompleteCount) || hasCount(val.alreadyConfirmCompleteCount),
          title: '远程异常',
          subtitle: '当日终止',
          tooltip: `当前远程停送电中，设备出现异常的数量。`,
          subTooltip: '当日停送电单单据状态已终止的单数。',
          count: val.waitConfirmCompleteCount || 0,
          subCount: val.alreadyConfirmCompleteCount || 0,
        },
        {
          key: 'today-task',
          show: hasCount(val.duringCount) || hasCount(val.alreadyCompleteCount),
          title: '当日已完成',
          subtitle: '进行中',
          tooltip: `当日停送电单中，停送电单的状态是“已完成”的数量。`,
          subTooltip: '当前停送电中单据状态是进行中的单数。',
          count: val.alreadyCompleteCount || 0,
          subCount: val.duringCount || 0,
        },
      ];
    },
  );

  function handleClickCardItem(item) {
    emit('choose', item);
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-power-failure-notification';

  .bgImage(@color) {
    background-image: radial-gradient(
      circle at 47px -80px,
      fade(@color, 100%) 0%,
      fade(@color, 100%) 50%,
      transparent 50%,
      transparent
    );
  }

  .@{prefix-cls} {
    @apply shadow-md rounded-lg overflow-hidden fixed z-99 cursor-pointer flex bg-white;

    .card-item {
      height: 100px;
      padding: 10px 16px;
      display: flex;
      flex-direction: column;
      background-size: 300px;

      &.wait-confirm {
        .bgImage(@warning-color);
      }

      &.wait-dispatch-test {
        .bgImage(lighten(@warning-color, 10%));
      }

      &.wait-dispatch {
        .bgImage(lighten(@warning-color, 20%));
      }

      &.remote-error {
        .bgImage(@error-color);
      }

      &.today-task {
        .bgImage(@success-color);
      }

      .item-header {
        @apply flex-1 text-white;

        header {
          height: 22px;
          font-size: 22px;
          line-height: 22px;
          text-align: center;
          font-weight: bolder;
          margin-bottom: 5px;
        }

        p {
          padding-top: 5px;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          font-weight: bolder;
        }
      }

      footer {
        height: 12px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
      }
    }

    .close {
      width: 60px;
      height: 60px;
      line-height: 94px;
      padding-left: 10px;
      top: -30px;
      right: -30px;
      @apply shadow bg-white absolute rounded-bl-full text-success;
    }
  }
</style>

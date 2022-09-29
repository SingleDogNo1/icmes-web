import { PropType } from 'vue';

export const basicProps = {
  /** 滚动列表的宽度, 默认值 100%. 当滚动方向为水平滚动时必填(需要确定的宽度计算相关值) */
  width: {
    type: [Number, String],
    default: '100%',
  },
  /** 滚动列表的高度, 默认值 100%. 当滚动方向为竖直滚动时必填(需要确定的宽度计算相关值) */
  height: {
    type: [Number, String],
    default: '100%',
  },
  /** 虚拟列表数据 */
  data: {
    type: Array as PropType<Recordable[]>,
    required: true,
  },
  /** 滚动方向 */
  scrollDirection: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'vertical',
  },
  /** 配合 scrollToIndex 使用, 控制当前焦点的对齐方式 */
  scrollToAlignment: {
    type: String as PropType<'auto' | 'start' | 'center' | 'end'>,
    default: 'auto',
  },
  /** 在显示内容之外预加载的缓冲列表项个数，用来优化滚动时的效果 */
  buffer: {
    type: Number,
    default: 4,
  },
  /** 列表项的高度/宽度(取决于滚动方向), 必填(用于计算列表高度). 可以是具体的数字或返回给定高度的函数 */
  itemSize: {
    type: [Number, Function] as PropType<number | ((index: number) => number)>,
    required: true,
  },
  /** 设置滚动的偏移量 */
  scrollOffset: {
    type: Number,
  },
  /** 设置滚动到列表项的索引 */
  scrollToIndex: {
    type: Number,
  },
};

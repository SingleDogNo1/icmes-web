# Calendar

日历组件

## Usage

```vue
<template>
  <Calendar />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Calendar } from '/@/components/Calendar';

  export default defineComponent({
    components: {
      Calendar,
    },
  });
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :-: |
| selectMode | String | `select` | 日历的选择模式。`select -- 单选`，`multi -- 多选`，`range -- 单选选择范围`，`multiRange -- 范围多选` |
| mode | String | `month` | 日历的显示模式。`month -- 按月显示`，`week --按周显示`，`monthRange -- 按月显示范围` |
| selectDate | `String / Array / Object` | - | 设置选择的日期。不同的选择模式下，需要对应不同的数据类型。 `String` 类型对应在 'select' 模式下，`String[]` 数组类型对应在 'multi' 模式下，`{start: String; end: String}` 类型对应在 'range' 模式下，`{start: String; end: String}[]` 数组类型对应在 'multiRange' 模式下 |
| monthRange | `String[]` | - | `monthRange`选择模式下生效，设置要显示的月份的内容。eg: `[2021-1、2021-2、2021-3]` |
| remarks | `Object` | - | 创建某一天的备注，key 是日期字符串，value 是备注内容。 eg: `{'2021-1-13'：'一些备注'}` |
| tileContent | `Object` | - | 创建某一天的贴片内容，key 是日期字符串，value 是 object 类型，`object`有**className**和**content**字段。eg: `{2021-1-5'：{className:'tip class'，content:'some tip'}` |
| holidays | `Object` | - | 自定义节假日信息，eg: `{'2021-1 ':'New Year'}` |
| completion | `Boolean` | `false` | 是否使用空白行补全日历 |
| useSwipe | `Boolean` | `true` | 启用移动端支持手势滑动切换日历 |
| monFirst | `Boolean` | `false` | 是否将周一设置为每周的开始（默认否，表示开始为周日） |
| backgroundText | `Boolean` | `false` | 是否显示当前月份的背景文本 |
| language | `String` | `cn` | 日历显示的语言。`en -- 英文`，`cn -- 中文` |
| format | `(year, month) => [String, String]` |  | 格式化头部的日期显示。返回一个数组，该数组的内容是对应的年和月 |
| weeks | `String[]` | - | 自定义标题的每周显示内容，eg: `['一', '二', '三', '四', '五', '六', '日']` |
| begin | `String` | - | 设置开始的可用日期，在此之前的日期将被禁用 |
| end | `String` | - | 设置结束的可用日期，在此之后的日期将被禁用 |
| disabled | `String[]` | - | 禁用某些日期，eg: `['2021-1-9', '2021-2-5']` |
| lunar | `Boolean` | `true` | 是否显示农历信息 |
| customDays | `Object` | - | 根据需要自定义特殊日期格式 |
| className | `String` | - | 自定义日历组件类名 |

## Methods

| 名称 | 回调函数 | 说明 |
| --- | --- | --- |
| onSelect | (selectDate) => void | 选择日期时触发此函数 |
| onMonthChange | (year, month, day) => void | 当月份发生变化时会触发该回调 |
| next | (year, month) => void | 进入下月时触发该回调方法 |
| prev | (year, month) => void | 进入上月时触发该回调方法 |
| setToday | ref method | 回到今天，通过 ref 获取组件实例，调用 `setToday` 方法 |

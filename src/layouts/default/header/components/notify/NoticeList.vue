<template>
  <a-button v-if="list.length" class="mb-2.5" @click="handleTitleClick(-1)">
    全部标记为已读
  </a-button>
  <List :class="prefixCls" :pagination="getPagination" :loading="loading">
    <template v-for="item in list" :key="item.id">
      <ListItem class="list-item" @click="handleTitleClick(item)">
        <ListItemMeta>
          <template #title>
            <div class="title">
              <Badge :dot="!item.readed">
                <TypographyParagraph
                  style="width: 100%; margin-bottom: 0 !important"
                  :style="{ cursor: 'pointer' }"
                  :ellipsis="
                    props.titleRows && props.titleRows > 0
                      ? { rows: $props.titleRows, tooltip: !!item.businessData.title }
                      : false
                  "
                  :content="item.businessData.title"
                />
              </Badge>
            </div>
          </template>

          <template #avatar>
            <Avatar class="avatar" :src="genAvatar(item.businessType)" />
          </template>

          <template #description>
            <div>
              <div class="description" v-if="item.businessData.content">
                <TypographyParagraph
                  style="width: 100%; margin-bottom: 0 !important"
                  :ellipsis="
                    $props.descRows && $props.descRows > 0
                      ? { rows: $props.descRows, tooltip: !!item.businessData.content }
                      : false
                  "
                  :content="item.businessData.content"
                />
              </div>
              <div class="datetime">
                {{ parseDate(item.updateTime) }}
              </div>
            </div>
          </template>
        </ListItemMeta>
      </ListItem>
    </template>
  </List>
</template>
<script lang="ts" setup>
  import { computed, PropType, ref, watch, unref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { List, Avatar, Typography, Badge } from 'ant-design-vue';
  import { MessageModel } from '/@/api/notice/model/messageModel';
  import { dateUtil } from '/@/utils/dateUtil';
  import { BusinessTypeEnum } from './helper';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;
  const TypographyParagraph = Typography.Paragraph;

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array as PropType<MessageModel[]>,
      default: () => [],
    },
    pageSize: {
      type: [Boolean, Number] as PropType<Boolean | Number>,
      default: 5,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalCount: {
      type: Number,
      default: 1,
    },
    titleRows: {
      type: Number,
      default: 1,
    },
    descRows: {
      type: Number,
      default: 2,
    },
    onTitleClick: {
      type: Function as PropType<(Recordable) => void>,
    },
  });

  const emit = defineEmits(['update:currentPage']);

  const { prefixCls } = useDesign('header-notify-list');
  const current = ref(props.currentPage || 1);

  const getPagination: any = computed(() => {
    const { list, pageSize, totalCount } = props;
    console.log('list :>> ', list);
    if (list.length) {
      return {
        total: totalCount,
        pageSize,
        size: 'small',
        current: unref(current),
        onChange(page) {
          current.value = page;
          emit('update:currentPage', page);
        },
      };
    } else {
      return false;
    }
  });

  function handleTitleClick(item: MessageModel | -1) {
    if (item === -1) {
      props.onTitleClick?.(item);
    } else {
      if ((item as MessageModel).readed) {
        return;
      }
      props.onTitleClick?.((item as MessageModel).id);
    }
  }

  // 根据业务类型选择对应的图标
  function genAvatar(type) {
    if (!type) {
      return new URL(`./images/default.png`, import.meta.url).href;
    }

    return new URL(`./images/${BusinessTypeEnum[type]}.png`, import.meta.url).href;
  }

  const parseDate = (date: number) => dateUtil(date).format('MM-DD HH:mm:ss');

  watch(
    () => props.currentPage,
    (v) => {
      current.value = v;
    },
  );
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notify-list';

  .@{prefix-cls} {
    &::-webkit-scrollbar {
      display: none;
    }

    ::v-deep(.ant-pagination-disabled) {
      display: inline-block !important;
    }

    &-item {
      padding: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      .title {
        margin-bottom: 8px;
        font-weight: normal;

        .extra {
          float: right;
          margin-top: -1.5px;
          margin-right: 0;
          font-weight: normal;

          .tag {
            margin-right: 0;
          }
        }

        .avatar {
          margin-top: 4px;
        }

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .datetime {
          margin-top: 4px;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
</style>

<template>
  <div :class="prefixCls">
    <Popover
      title=""
      trigger="click"
      :overlayClassName="`${prefixCls}__overlay`"
      @visibleChange="toggleShow"
    >
      <Badge :count="count" :offset="[-5, 15]">
        <Icon icon="fa-regular:bell" :size="18" />
      </Badge>
      <template #content>
        <NoticeList
          :loading="loading"
          :list="listData"
          :pageSize="form.pageSize"
          :totalCount="total"
          @title-click="onNoticeClick"
          @update:currentPage="handleChangeCurrentPage"
        />
      </template>
    </Popover>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { Popover, Badge } from 'ant-design-vue';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Icon } from '/@/components/Icon';
  import { getNoticeListApi, readNoticeByIdApi } from '/@/api/notice/message';
  import { MessageModel } from '/@/api/notice/model/messageModel';
  import { error } from '/@/utils/log';

  defineProps({
    count: {
      type: Number,
      required: true,
    },
  });

  const loading = ref<boolean>(false);
  const { prefixCls } = useDesign('header-notify');
  const listData = ref<MessageModel[]>([]);
  const form = ref({
    pageNo: 1,
    pageSize: 5,
  });

  const total = ref<number>(0);

  async function getNoticeList() {
    loading.value = true;
    try {
      const { items, totalCount } = await getNoticeListApi(unref(form));
      items?.map((item) => {
        // item.businessData 值为字符串，需要 parse 才能使用
        item.businessData = JSON.parse(item.businessData as unknown as string);
      });
      listData.value = items ?? [];
      total.value = totalCount;
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function toggleShow(visible: boolean) {
    if (visible) {
      getNoticeList();
    }
  }

  async function onNoticeClick(id: number) {
    loading.value = true;
    try {
      const res = await readNoticeByIdApi(id);
      console.log('res :>> ', res);
      await getNoticeList();
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function handleChangeCurrentPage(pageNo) {
    form.value = { ...unref(form), ...{ pageNo } };
    getNoticeList();
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      width: 420px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>

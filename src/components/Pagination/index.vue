<template>
  <Pagination
    hide-no-single-page
    show-quick-jumper
    show-size-changer
    v-model:current="current"
    :total="total"
    :page-size-options="pageSizeOptions"
    @change="handlePageChange"
    @show-size-change="handleSizeChange"
  >
    <template #buildOptionText="row">
      <span>{{ row.value }}条/页</span>
    </template>
  </Pagination>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Pagination } from 'ant-design-vue';

  interface Props {
    pageNo?: number;
    total: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    pageNo: 1,
  });

  const emit = defineEmits(['change', 'size-change']);

  const current = ref<number>(props.pageNo);
  const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50']);

  function handlePageChange(pageNo: number) {
    emit('change', pageNo);
  }

  function handleSizeChange(current, size) {
    emit('size-change', current, size);
  }
</script>

<template>
  <PageWrapper contentFullHeight dense class="bg-white">
    <Calendar
      class="w-2/3 mx-auto mt-4 shadow-md border"
      backgroundText
      class-name="range-mode"
      :format="format"
      :disabled="['2022-2-2']"
      completion
      :holidays="holidays"
      @on-select="onSelect"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Calendar } from '/@/components/Business';

  const format = (year, month) => [`${year}年`, `${month}月`];

  const holidays = ref({
    '1-1': 'New Year',
    '2-2': 'Wetlands',
    '2-14': 'Valentine',
    '3-8': 'Women',
    '4-1': 'April Fools',
    '4-22': 'World Earth',
    '5-1': 'Labour',
    '6-1': 'Children',
    '8-1': 'Youth',
    '10-5': 'World Teachers',
    '10-31': 'Halloween',
    '12-25': 'Christmas',
  });

  function onSelect(selectDate) {
    console.log(selectDate, 'selectDate');
  }
</script>

<template>
  <PageWrapper content-full-height fixed-height dense>
    <DragPanel :min-percent="0" :default-percent="30" split="vertical">
      <template #paneL> A </template>
      <template #paneR>
        <DragPanel split="horizontal">
          <template #paneL> B </template>

          <template #paneR>
            <DragPanel split="vertical" :default-percent="30">
              <template #paneL> C </template>

              <template #paneR>
                <DragPanel split="horizontal">
                  <template #paneL> D </template>
                  <template #paneR> E </template>
                </DragPanel>
              </template>
            </DragPanel>
          </template>
        </DragPanel>
      </template>
    </DragPanel>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { DragPanel } from '/@/components/DragPanel';
  import { PageWrapper } from '/@/components/Page';
</script>

<template>
  <PageWrapper>
    <div class="lg:flex">
      <div class="lg:w-8/24">
        <ProductionOutputCard />
      </div>
      <div class="lg:w-16/24">
        <ProductionMixCard />
      </div>
    </div>

    <div class="lg:flex">
      <div class="lg:w-14/24">
        <QuickAshCard />
      </div>
      <div class="lg:w-10/24">
        <QuickSandCard />
      </div>
    </div>

    <div class="lg:flex">
      <div class="lg:w-8/24">
        <RawCoalStorageCard />
      </div>
      <div class="lg:w-16/24">
        <ProductCoalStorageCard />
      </div>
    </div>

    <div class="lg:flex">
      <div class="lg:w-14/24">
        <EnergyConsumptionStatisticsCard />
      </div>
      <div class="lg:w-10/24">
        <MaintenanceCard />
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ProductionBoard',
  };
</script>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import ProductionOutputCard from './components/productionOutputCard.vue';
  import ProductionMixCard from './components/productMixCard.vue';
  import QuickAshCard from './components/quickAshCard.vue';
  import QuickSandCard from './components/quickSandCard.vue';
  import RawCoalStorageCard from './components/rawCoalStorageCard.vue';
  import ProductCoalStorageCard from './components/productCoalStorageCard.vue';
  import EnergyConsumptionStatisticsCard from './components/energyConsumptionStatisticsCard.vue';
  import MaintenanceCard from './components/maintenanceCard.vue';
</script>

<style scoped>
  .production-board {
    color: red;
  }
</style>

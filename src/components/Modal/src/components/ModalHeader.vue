<template>
  <BasicTitle :helpMessage="helpMessage" @dblclick="handleDbclick">
    {{ title }}
  </BasicTitle>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { BasicTitle } from '/@/components/Basic';

  export default defineComponent({
    name: 'BasicModalHeader',
    components: { BasicTitle },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
      },
      title: { type: String },
    },
    emits: ['dblclick'],
    setup(_props, { emit }) {
      function handleDbclick(e) {
        e.stopPropagation(e);
        emit('dblclick', e);
      }
      return { handleDbclick };
    },
  });
</script>

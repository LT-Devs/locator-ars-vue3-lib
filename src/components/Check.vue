<template>
  <slot v-if="can && !isInitialLoading" />
  <slot name="fallback" v-else-if="!isLoading && !isInitialLoading && !can" />
  <slot name="loading" v-else-if="isLoading || isInitialLoading" />
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType, ref, onMounted } from 'vue';
import { usePermissions } from '../composables/usePermissions';

export default defineComponent({
  name: 'Check',
  props: {
    action: {
      type: [String, Array] as PropType<string | string[]>,
      required: true
    },
    fallback: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { action } = toRefs(props);
    const isInitialLoading = ref(true);
    const { can, isLoading, check } = usePermissions(action, { autoCheck: false });

    onMounted(async () => {
      await check();
      isInitialLoading.value = false;
    });

    return {
      can,
      isLoading,
      isInitialLoading
    };
  }
});
</script>
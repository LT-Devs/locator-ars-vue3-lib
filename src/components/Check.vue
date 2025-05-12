<template>
  <slot v-if="can" />
  <slot name="fallback" v-else-if="!isLoading" />
  <slot name="loading" v-else />
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType } from 'vue';
import { usePermissions } from '../composables/usePermissions';

export default defineComponent({
  name: 'Check',
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    fallback: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { action } = toRefs(props);
    const { can, isLoading } = usePermissions(action, { autoCheck: true });

    return {
      can,
      isLoading
    };
  }
});
</script> 
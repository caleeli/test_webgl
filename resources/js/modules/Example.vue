<template>
  <webgl></webgl>
</template>

<script>
export default {
  path: "/",
  mixins: [window.workflowMixin],
  data() {
    return {
      today: window.moment().format()
    };
  }
};
</script>

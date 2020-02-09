<template>
  <div class="card w-50 position-absolute" style="left: 25%; top: 3em; opacity: 0.7;" v-show="show">
    <div class="card-header">{{ title }}</div>
    <div class="card-body">
      <form @submit.stop.prevent="submit">
        <p>
          <input ref="input" class="form-control" v-model="local" />
        </p>
        <button class="btn btn-primary">Ok</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: "",
      local: "",
      resolve: null
    };
  },
  methods: {
    ask(title, value = "") {
      return new Promise((resolve, reject) => {
        this.title = title;
        this.show = true;
        this.local = value;
        this.resolve = resolve;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      });
    },
    submit() {
      this.show = false;
      this.resolve ? this.resolve(this.local) : null;
    }
  }
};
</script>

<style>
</style>

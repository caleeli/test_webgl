<template>
  <div
    class="position-absolute"
    :class="`place-${place}`"
    style="top: 2em; opacity: 0.7;"
    v-show="show"
  >
    <form @submit.stop.prevent="submit">
      <label for="input" class="text-white">{{ placeholder }}</label>
      <input ref="input" id="input" type="number" size="3" style="width:3em;" v-model="local" />
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: "",
      local: "",
      place: 0,
      placeholder: "",
      resolve: null
    };
  },
  methods: {
    ask(title, placeholder, place, value = "") {
      return new Promise((resolve, reject) => {
        this.title = title;
        this.placeholder = placeholder;
        this.show = true;
        this.local = value;
        this.resolve = resolve;
        this.place = place;
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
.place-0 {
  left: 1em;
}
.place-1 {
  right: 1em;
}
</style>

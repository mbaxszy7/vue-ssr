<template>
  <div id="app">
    <div>The visited URL is: {{ url }}</div>
    <input type="text" v-model="message" />
    <button @click="onClick">click test</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: "hello vue ssr",
    };
  },
  methods: {
    onClick() {
      console.log(this.message, "click test");
    },
  },
};
</script>

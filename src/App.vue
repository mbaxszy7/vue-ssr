<template>
  <div id="app">
    <div>The visited URL is: {{ url }}</div>
    <p>{{ message }}</p>
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
      this.message += "click test";
      console.log(this.message, "click test");
    },
  },
};
</script>

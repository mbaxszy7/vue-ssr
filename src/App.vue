<template>
  <div id="app">
    <ul>
      <li><router-link to="/">home</router-link></li>
      <li><router-link to="/about">about</router-link></li>
    </ul>
    <router-view />
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
    }
  },
  methods: {
    onClick() {
      this.message += "click test"
      console.log(this.message, "click test")
    },
  },
}
</script>

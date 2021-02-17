<template>
  <div>
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  name: "Home",
  metaInfo: {
    title: "首页",
  },
  data() {
    return {
      name: "Home",
    }
  },
}
</script>

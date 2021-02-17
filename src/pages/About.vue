<template>
  <div>
    <h1>{{ pagename }}</h1>
  </div>
</template>

<script>
export default {
  name: "About",
  metaInfo: {
    title: "关于",
  },
  data() {
    return {
      pagename: "about",
    }
  },
}
</script>

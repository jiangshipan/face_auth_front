<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  padding-top: 60px;
  height: 100vh;
  width: 100vw;
  background: url("assets/images/background.jpeg") no-repeat center center;
  background-size:cover;
  background-attachment:fixed;
}
</style>

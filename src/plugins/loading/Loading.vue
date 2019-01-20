<template>
    <div class="loading">
        <van-loading type="spinner" />
    </div>
</template>

<script>

    export default {
        name: "Loading"
    }
</script>

<style scoped lang="stylus">
    .loading
        position fixed
        left 50%
        top 50%
        transform translate(-50%, -50%)
        z-index 3000
        width 30px
        height 30px
</style>
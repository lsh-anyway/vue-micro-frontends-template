<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Page extends Vue {}
</script>

<style scoped>

</style>

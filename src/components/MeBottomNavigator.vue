<template>
    <div class="_panel" :class="$style.root">
        <nuxt-link class="transition-colors" v-for="navigation in navigations" :key="navigation.to" :to="navigation.to" :class="$style.item, { [$style.active]: $route.path === navigation.to }">
            <component :is="navigation.icon" />
            <span class="text-sm">{{ navigation.text }}</span>
        </nuxt-link>
    </div>
</template>

<script setup lang="ts">
defineProps({
    navigations: {
        type: Array as PropType<{
            icon?: Component
            text: string
            to: string
        }[]>,
        required: true
    }
})
</script>

<style module lang="scss">
.root {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max(100px, 10%);
    padding: 8px 0;
}

.item.active {
    color: var(--color-accent);
}
</style>
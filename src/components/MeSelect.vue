<template>
    <div>
        <div class="_label">{{ label }}</div>
        <div :class="$style.root">
            <select v-model="modelValueRef" :disabled="disabled" :readonly="readonly" :class="$style.select">
                <option v-for="(value, key) in opts" :key="key">{{ value }}</option>
            </select>
            <ChevronDownIcon :class="$style.arrow" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from 'vue-tabler-icons'

const props = defineProps<{
    modelValue: string,
    readonly? : boolean,
    disabled? : boolean,
    items: string[] | Record<string, string>
    label?: string,
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void
}>()

const { modelValue } = toRefs(props)
const modelValueRef = ref(modelValue.value)

watch(modelValueRef, (value) => {
    emit('update:modelValue', value)
})

watch(modelValue, (value) => {
    modelValueRef.value = value
})

const opts = computed(() => {
    if (Array.isArray(props.items)) {
        const items = {} as Record<string, string>
        for (const item of props.items) {
            items[item] = item
        }
        return items
    } else {
        return props.items
    }
})
</script>

<style module lang="scss">
.root {
	position: relative;
	cursor: pointer;
}

.select {
    display: block;
	height: 39px;
	width: 100%;
	padding: 0 12px;
	color: var(--color-foreground);
	background: var(--color-panel);
	border: solid 1px var(--color-panel);
	border-radius: 6px;
	transition: border-color 0.1s ease-out;
	cursor: pointer;
    appearance: none;

    &:hover {
        border-color: var(--color-accent);
    }

    options {
        color: var(--color-foreground);
        background: var(--color-panel);
    }
}

.arrow {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0 12px;
    height: 39px;
    pointer-events: none;
}
</style>
<template>
    <div class="_label">{{ label }}</div>
    <div :class="$style.root">
    	<input type="checkbox" :class="$style.input">
    	<span :class="[$style.button, { [$style.checked]: switchValue }]" @click.prevent="toggle">
    		<div :class="$style.knob"></div>
    	</span>
        <span :class="$style.text" @click="toggle"><slot></slot></span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean,
    label?: string,
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
    (event: 'click'): void
}>()

const { modelValue } = toRefs(props)
const switchValue = ref(modelValue.value)

watch(modelValue, (v) => {
    switchValue.value = v
})

function toggle() {
    switchValue.value = !switchValue.value
    emit('update:modelValue', switchValue.value)
    emit('click')
}
</script>

<style module lang="scss">
.root {
    position: relative;
    display: flex;
    user-select: none;
}

.input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;
	margin: 0;
}

.button {
    position: relative;
    box-sizing: border-box;
    width: 50px;
    height: 28px;
    background: rgba(0, 0, 0, 0.1);
    border: solid 1px rgba(0, 0, 0, 0.1);;
    border-radius: 999px;
    cursor: pointer;
	transition: inherit;
	user-select: none;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-accent) !important;
    }

    &.checked {
        background-color: var(--color-accent-background);
        border-color: var(--color-accent-background);
        
        > .knob {
            left: 26px;
            background: var(--color-accent);
        }
    }
}

.knob {
	position: absolute;
	top: 4px;
	left: 4px;
	width: 18px;
	height: 18px;
	background: #fff;
	border-radius: 999px;
	transition: all 0.2s ease;
}

.text {
    margin-left: 12px;
	cursor: pointer;
}
</style>
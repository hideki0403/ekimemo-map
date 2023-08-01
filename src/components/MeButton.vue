<template>
    <button :type="type" :class="[$style.root, { [$style.primary]: primary, [$style.danger]: danger, [$style.rounded]: rounded }]" @click="emit('click', $event)">
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
defineProps<{
    type?: 'button' | 'submit' | 'reset'
    primary?: boolean | Ref<boolean>
    danger?: boolean
    to?: string
    rounded?: boolean
}>()

const emit = defineEmits<{
    (ev: 'click', payload: MouseEvent): void
}>()
</script>

<style module lang="scss">
.root {
    display: flex;
    padding: 7px 14px;
    font-size: 95%;
    text-decoration: none;
    gap: 6px;
	background: var(--color-panel);
    border-color: var(--color-panel);
    border-width: 1px;
	border-radius: 5px;
	transition: background 0.1s ease;

	&:hover:not(:disabled) {
        border-color: var(--color-accent) !important;
	}

    &:active:not(:disabled) {
        background: rgba(0, 0, 0, 0.1) !important;
    }

	&.rounded {
		border-radius: 999px;
	}

	&.primary {
		color: var(--color-accent);
		background: var(--color-accent-background);
        border-color: var(--color-accent-background);
	}

    &:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }
}
</style>

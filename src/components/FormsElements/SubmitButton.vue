<script setup lang="ts">
// import { SubmitButtonProps as SubmitButtonPropsSource } from "../types";

import { IconPosition } from '@syncfusion/ej2-buttons';
import { computed } from 'vue';


// export btn_theme;
export interface SubmitButtonProps {//extends HTMLProps<HTMLButtonElement> {
    title?: string;
    bootstrap_syncfusion?: 'bs' | 'sf';
    fs_isPrimary?: boolean;
    btn_theme: "btn-primary" | "btn-secondary" | "btn-success" | "btn-danger" | "btn-warning" | "btn-info" | "btn-light" | "btn-dark";
    //   theme?: FormTheme;
    disabled?: boolean;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;

    //fs props
    iconCss?: string;
    iconPosition?: "Left" | "Right";
}
const props = withDefaults(defineProps<SubmitButtonProps>(), {
    bootstrap_syncfusion: 'bs',
    fs_isPrimary: true,
    disabled: false
})

const bs_class_label_boostrap = computed(() => (props.bs_class_label ?? '') + (props.iconPosition === 'Left' ? "flex-row-reverse" : "flex-row")) 
</script>
<template>
    <!-- className={`disabled:opacity-70 ${ (theme?.branding=='full' ?
        bgLightColorMap.get(theme?.color) : bgColorMap.get(theme?.color)) || 'bg-red-900' } ${ theme?.branding=='full' ?
        textColorMap.get(theme?.color) : 'text-white' } ${submitButtonStyle}`} {...rest} -->
    <div :class="bs_class_wrap">
        <ejs-button v-if="bootstrap_syncfusion === 'sf'" @click="$emit('click')" :isPrimary='fs_isPrimary' :cssClass="bs_class_input"
            :disabled="disabled" :iconCss="iconCss" :iconPosition="iconPosition">
            <span :class="bs_class_label">{{ title }}</span>
        </ejs-button>

        <button v-else type='submit' class="btn" @click="$emit('click')" :class="btn_theme + ' ' + bs_class_input"
            :disabled="disabled">
            <div class="d-flex" :class="bs_class_label_boostrap">
                <span>{{ title }}</span>
                <span :class="iconCss"></span>
            </div>
        </button>
    </div>
</template>
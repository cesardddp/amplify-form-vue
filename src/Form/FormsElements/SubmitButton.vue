<script lang="ts">
import { IconPosition } from '@syncfusion/ej2-buttons';
import { PropType, computed, defineComponent } from 'vue';

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


export default defineComponent({
    props: {
        submit_props: {
            type: Object as PropType<SubmitButtonProps>,
            default: {
                bootstrap_syncfusion: 'bs',
                fs_isPrimary: true,
                disabled: false,
                btn_theme: 'btn-outline-primary'

            }
        }
    },

    computed: {
        bs_class_label_boostrap() {
            return (this.$props.submit_props.bs_class_label ?? '') + (this.submit_props.iconPosition === 'Left' ? "flex-row-reverse" : "flex-row")
        }
    }
})



</script>
<template>
    <!-- className={`disabled:opacity-70 ${ (theme?.branding=='full' ?
                bgLightColorMap.get(theme?.color) : bgColorMap.get(theme?.color)) || 'bg-red-900' } ${ theme?.branding=='full' ?
                textColorMap.get(theme?.color) : 'text-white' } ${submitButtonStyle}`} {...rest} -->
    <div :class="submit_props.bs_class_wrap">
        <!-- @click="$emit('click')" -->
        <ejs-button v-if="(submit_props.bootstrap_syncfusion ?? 'bs') === 'sf'" :isPrimary='submit_props.fs_isPrimary'
            :cssClass="submit_props.bs_class_input" :disabled="submit_props.disabled" :iconCss="submit_props.iconCss"
            :iconPosition="submit_props.iconPosition">
            <span :class="submit_props.bs_class_label">{{ submit_props.title }}</span>
        </ejs-button>

        <!-- @click="$emit('click')" -->
        <button v-else type='submit' class="btn "
            :class="(submit_props.btn_theme ?? 'btn-outline-primary') + ' ' + submit_props.bs_class_input"
            :disabled="submit_props.disabled">
            <div class="d-flex" :class="bs_class_label_boostrap">
                <span>{{ submit_props.title ?? 'Enviar' }}</span>
                <span :class="submit_props.iconCss"></span>
            </div>
        </button>
    </div>
</template>
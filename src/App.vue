<script setup lang="ts">
// import awsconfig from './old.js';
import AmplifyFormVue from "./components/AmplifyForm.vue";
import { AmplifyFormProps } from "./components/types";
import schema from "./example/schema.json";
const props: AmplifyFormProps = {
  graphQLJSONSchema: schema,
  entity: 'Campo',
  onSubmit: () => console.log('submit'),
}
const form_refs = (e:any)=>console.log(e);

</script>

<template>
      <AmplifyFormVue :form_props="props" />
</template>

<style scoped>

</style>

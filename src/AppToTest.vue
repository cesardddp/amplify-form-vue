<script setup lang="ts">
import { ref, watch } from "vue";
import testForm from "./Form/tests/testForm.vue";
import testTabela from "./Grid/testTabela.vue";

const exibir = ref<'form' | 'tabela'>('tabela')
watch(exibir, (exibir) => {
  console.clear()
  console.log(exibir)
})
</script>

<template>
  <ul class="nav justify-content-center  ">
    <li class="nav-item">
      <button @click="exibir='tabela'"  class="nav-link active" aria-current="page">tabela</button>
    </li>
    <li class="nav-item">
      <button @click="exibir='form'"  class="nav-link">form</button>
    </li>
  </ul>

  <testTabela v-if="exibir === 'form'" />
  <testForm v-else />
</template>

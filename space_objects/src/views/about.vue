<template>
  <v-container>
    <v-row>
      <v-col class="heading-bold">Space tracker</v-col>
    </v-row>
    <v-row>
      <v-col class="heading-bold">
        <v-data-table
          :headers="headers"
          :items="saved_data"
          item-value="name"
          fixed-header
          hide-default-footer
          variant="flat"
          dark
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Satellite {
  noradCatId: number;
  countryCode: string;
  objectType: string;
  name: string;
  // you can add other properties if needed
}

const headers = [
  { title: "Name", align: "start", key: "name" },
  { title: "Norad CatId", align: "end", key: "noradCatId" },
  { title: "Country Code", align: "end", key: "countryCode" },
  {
    title: "Object Type",
    align: "end",
    key: "objectType",
  },
] as { title: string; align: string; key: keyof Satellite }[];

const saved_data = ref<Satellite[]>([]);

onMounted(() => {
  const data = localStorage.getItem("saved_data");

  if (data) {
    try {
      saved_data.value = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing localStorage data.", error);
      saved_data.value = []; // fallback to empty array
    }
  } else {
    saved_data.value = []; // fallback to empty array if not found
  }
});
</script>


<style scoped>
</style>
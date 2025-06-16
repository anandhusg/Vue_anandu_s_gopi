<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="heading-bold">Space tracker</v-col>
      </v-row>

      <!-- Search Section -->
      <v-row justify="space-between">
        <v-col cols="4">
          <v-text-field
            label="Search by Name or NoradCatId"
            prepend-inner-icon="mdi-magnify"
            v-model="searchTerm"
            @keydown.enter="applySearch"
          ></v-text-field>
        </v-col>

        <v-col cols="4" align="end">
          <span class="sub-heading">
            Total Count :
            <span class="countcolor sub-heading-bold">
              {{ filteredSatellites.length }}</span
            >
          </span>
        </v-col>
      </v-row>
    </v-container>

    <!--Table Section -->
    <v-container>
      <v-row>
        <v-col cols="9">
          <v-row class="mb-10 mr-1">
            <v-col class="card-border">
              <v-row class="text mb-5">
                <v-col cols="2"
                  ><v-btn variant="" @click="sortTable('name')">
                    Name</v-btn
                  ></v-col
                >
                <v-col cols="2"
                  ><v-btn variant="" text @click="sortTable('noradCatId')"
                    >Norad CatId</v-btn
                  ></v-col
                >
                <v-col cols="1"
                  ><v-btn variant="" text @click="sortTable('orbitCode')"
                    >Orbit Code</v-btn
                  ></v-col
                >
                <v-col cols="2"
                  ><v-btn variant="" text>Object Type</v-btn></v-col
                >
                <v-col cols="2"
                  ><v-btn variant="" text @click="sortTable('countryCode')"
                    >Country Code</v-btn
                  ></v-col
                >
                <v-col cols="2"
                  ><v-btn variant="" text @click="sortTable('launchDate')"
                    >Launch Date</v-btn
                  ></v-col
                >
                <v-col cols="1"
                  ><v-btn variant="" text @click="sortTable('launchDate')"
                    >Select</v-btn
                  ></v-col
                >
              </v-row>

              <RecycleScroller
                v-if="filteredSatellites.length > 0"
                class="scroller text"
                :items="filteredSatellites"
                :item-size="20"
                key-field="noradCatId"
              >
                <template #default="{ item, index }">
                  <v-row class="mt-1 listRow">
                    <v-col justify="center" cols="2" class="pl-5">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="2" class="pl-5"> {{ item.noradCatId }} </v-col>
                    <v-col cols="1" class="pl-5"> {{ item.orbitCode }}</v-col>
                    <v-col cols="2" class="pl-5"> {{ item.objectType }}</v-col>
                    <v-col cols="2" class="pl-5"> {{ item.countryCode }}</v-col>
                    <v-col cols="2" class="pl-5"> {{ item.launchDate }}</v-col>
                    <v-col cols="1" class="pl-5">
                      <v-checkbox
                        hide-details
                        density="compact"
                        v-model="item.selected"
                        @change="onCheckedChange(item, $event)"
                      >
                      </v-checkbox
                    ></v-col>
                  </v-row>
                </template>
              </RecycleScroller>

              <v-row v-else>
                <v-col cols="12">
                  <h1>
                    <!-- <v-img height="200px" src="https://i.gifer.com/ZZ5H.gif">
                    </v-img> -->
                    <v-img height="200px" src="https://i.pinimg.com/originals/3e/80/39/3e8039242e517ee7edc05a4e226e0b80.gif">
                    </v-img>
                   
                  </h1>
                </v-col>
                <v-col align="center" class=" sub-heading-bold pb-10">
                  Loading...!
                </v-col>

              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" class="pl-">
          <v-row class="card-border">
            <v-col cols="12">
              <v-icon size="30" color="primary">mdi-filter</v-icon> &nbsp;
              <span class="sub-heading-bold"> Filter </span>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Object Type"
                multiple
                :items="objectTypeOptions"
                v-model="selectedObjectTypes"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Orbit Code"
                multiple
                :items="orbitCodeOptions"
                v-model="selectedOrbitCodes"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-btn
                width="100%"
                rounded
                variant="tonal"
                class="tn"
                color="#33cc33"
                @click="applyFilters"
              >
                Apply Filters
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="card-border mt-6">
            <v-col cols="12">
              <v-icon size="30" color="primary">mdi-check</v-icon> &nbsp;
              <span class="sub-heading-bold"> {{selectedItems.length}} Selected Items </span>
            </v-col>
            <v-col cols="12" v-for="(item, i) in selectedItems" :key="i">
              {{ item.name }}
            </v-col>

            <v-col cols="12">
              <v-btn
                width="100%"
                rounded
                variant="tonal"
                class="tn"
                color="#33cc33"
                @click="saveToLocal()"
              >
                Proceed
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

interface Satellite {
  noradCatId: number;
  intlDes: string;
  name: string;
  launchDate: string;
  decayDate: string | null;
  orbitCode: string;
  countryCode: string;
  objectType: string;
  selected: boolean;
}

const searchTerm = ref<string>("");

const selectedObjectTypes = ref<string[]>([]);

const selectedOrbitCodes = ref<string[]>([]);

const objectTypeOptions = ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"];

const orbitCodeOptions = [
  "LEO",
  "LEO1",
  "LEO2",
  "LEO3",
  "LEO4",
  "MEO",
  "GEO",
  "HEO",
  "IGO",
  "EGO",
  "NSO",
  "GTO",
  "GHO",
  "HAO",
  "MGO",
  "LMO",
  "UFO",
  "ESO",
  "UNKNOWN",
] as string[];

const satellite_data = ref<Satellite[]>([]);

const whole_data = ref<Satellite[]>([]);

const filteredSatellites = computed<Satellite[]>(() => satellite_data.value);

const sortKey = ref<keyof Satellite | "">('');
const sortDirection = ref(1);

onMounted(() => {
  getData();
});

// API Call
async function getData() {
  try {
    const response = await fetch(
      "https://backend.digantara.dev/v1/satellites?objectTypes=ROCKET%20BODY,DEBRIS,UNKNOWN,PAYLOAD&attributes=noradCatId,intlDes,name,launchDate,decayDate,orbitCode,countryCode,objectType"
    );
    const result = await response.json();

    const corrected_data: Satellite[] = result.data.map((item: any) => {
      item.orbitCode = item.orbitCode.replace(/[{}]/g, "");
      item.selected = false;
      return item;
    });

    satellite_data.value = corrected_data;
    whole_data.value = corrected_data;
  } catch (error) {
    console.error(error);
  }
}

function applySearch() {
  filterSatellites();
}

function applyFilters() {
  filterSatellites();
}

function filterSatellites() {
  let arr = whole_data.value;

  // Filter by searchTerm (name or noradCatId)
  if (searchTerm.value.trim()) {
    arr = arr.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        item.noradCatId.toString().includes(searchTerm.value)
    );
  }

  // Filter by objectType
  if (selectedObjectTypes.value.length) {
    arr = arr.filter((item) =>
      selectedObjectTypes.value.includes(item.objectType)
    );
  }

  // Filter by orbitCode
  if (selectedOrbitCodes.value.length) {
    arr = arr.filter((item) =>
      selectedOrbitCodes.value.includes(item.orbitCode)
    );
  }

  // Sort after filtering
  if (sortKey.value) {
    arr.sort((a, b) => {
      if (a[sortKey.value]! < b[sortKey.value]!)
        return -1 * sortDirection.value;
      if (a[sortKey.value]! > b[sortKey.value]!)
        return 1 * sortDirection.value;

      return 0;
    });
  }

  satellite_data.value = arr;
}

function onCheckedChange(item: Satellite, isChecked: boolean) {
  if (isChecked) {
    if (selectedItems.value.length >= 10) {
      alert("You can select a maximum of 10 items.");
      return;
    }
    item.selected = true;
  } else {
    item.selected = false;
  }
}

function sortTable(key: keyof Satellite) {
  if (sortKey.value == key) {
    sortDirection.value *= -1;
  } else {
    sortKey.value = key;
    sortDirection.value = 1;
  }
  filterSatellites();
}

const selectedItems = computed<Satellite[]>(() =>
  satellite_data.value.filter((item) => item.selected)
);

function saveToLocal() {
  localStorage.setItem("saved_data", JSON.stringify(selectedItems.value));

  router.push("/about");

}
</script>


<style scoped>
.heading-bold {
  font-size: 24px;
  font-weight: bold;
}

.text {
  font-size: 16px;
}

.listRow {
  border-bottom: 1px solid #ccc;
}
</style>

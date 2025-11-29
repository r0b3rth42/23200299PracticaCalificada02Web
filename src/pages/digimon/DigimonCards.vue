
<template>
    <q-page padding class="digimon-page">
        <div class="page-header">
            <h2>Digimon Collection</h2>
            <p class="muted">Listado de Digimon desde la API pública — filtra por nombre o por nivel</p>
        </div>

        <div class="filters row items-center q-gutter-sm">
            <q-input
                v-model="searchName"
                placeholder="Buscar por nombre (p. ej. Agumon)"
                clearable
                class="col-12 col-sm-6"
                debounce="300"
            />

            <q-select
                v-model="selectedLevel"
                :options="levels"
                placeholder="Filtrar por nivel"
                clearable
                class="col-12 col-sm-4"
            />

            <q-btn label="Reset" flat color="primary" @click="resetFilters" class="col-12 col-sm-2" />
        </div>

        <div v-if="loading" class="q-mt-xl flex flex-center">
            <q-spinner-dots color="primary" size="50px" />
        </div>

        <div v-else>
            <div v-if="filteredDigimons.length === 0" class="no-results q-pa-lg">
                <p>No se encontraron Digimon con esos filtros.</p>
            </div>

            <div class="cards-grid q-gutter-md q-mt-md">
                <div v-for="digimon in filteredDigimons" :key="digimon.name" class="digimon-card">
                    <div class="card-media">
                        <img :src="digimon.img" :alt="digimon.name" loading="lazy" />
                    </div>
                    <div class="card-body">
                        <h3>{{ digimon.name }}</h3>
                        <p class="level">Nivel: <strong>{{ digimon.level }}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apiBase = 'https://digimon-api.vercel.app/api/digimon'

const digimons = ref([])
const loading = ref(false)
const searchName = ref('')
const selectedLevel = ref('')

async function fetchAll() {
    loading.value = true
    try {
        const { data } = await axios.get(apiBase)
        // API returns array of { name, img, level }
        digimons.value = Array.isArray(data) ? data : []
    } catch (err) {
        // Show nothing fancy here — console error is fine for now
        console.error('Error fetching Digimon:', err)
        digimons.value = []
    } finally {
        loading.value = false
    }
}

const levels = computed(() => {
    const set = new Set()
    digimons.value.forEach((d) => {
        if (d.level) set.add(d.level)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredDigimons = computed(() => {
    const nameFilter = searchName.value.trim().toLowerCase()
    const levelFilter = selectedLevel.value

    return digimons.value.filter((d) => {
        const matchesName = !nameFilter || d.name.toLowerCase().includes(nameFilter)
        const matchesLevel = !levelFilter || (d.level && d.level.toLowerCase() === levelFilter.toLowerCase())
        return matchesName && matchesLevel
    })
})

function resetFilters() {
    searchName.value = ''
    selectedLevel.value = ''
}

onMounted(() => {
    fetchAll()
})
</script>

<style scoped>
.digimon-page .page-header h2 {
    margin: 0;
    font-size: 1.6rem;
}

.digimon-page .muted {
    margin: 0.25rem 0 0.75rem 0;
    color: #64748b;
}

.filters { max-width: 1100px; margin: 0 auto; }

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    max-width: 1100px;
    margin: 0 auto;
}

.digimon-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e6edf3;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 6px 18px rgba(30, 41, 59, 0.06);
    transition: transform .12s ease-in-out, box-shadow .12s ease;
}

.digimon-card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(30, 41, 59, 0.12); }

.card-media img { width: 100%; height: 180px; object-fit: contain; background: linear-gradient(180deg,#f8fafc, #fff); padding: 12px; }

.card-body { padding: 12px; width: 100%; text-align: center; }
.card-body h3 { margin: 6px 0 4px; font-size: 1.05rem; }
.card-body .level { margin: 0; color: #475569; font-size: 0.9rem; }

.no-results { text-align: center; color: #475569; }

/* small screens */
@media (max-width: 600px) {
    .card-media img { height: 140px; }
}
</style>

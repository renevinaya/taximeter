<script setup lang="ts">
import { ref, computed } from 'vue'
import format from 'format-duration'
import currency from 'country-to-currency'

interface IRecord {
  start: Date,
  end?: Date
}

const currencies = new Set(Object.values(currency).sort())

const records = ref<Array<IRecord>>([])
const stopptimer = ref('0:00:00')
const useRate = ref(false)
const hourlyRate = ref(95)
const currencySymbol = ref('EUR')
const persons = computed(() => {
  const count = activeRecords()
  if (count === 1) {
    return '1 Person'
  } else if (count) {
    return count + ' Persons'
  } else {
    return 'No Persons'
  }
})

const addPerson = () => {
  const record: IRecord = {
    start: new Date()
  }
  records.value.push(record)
}

const isActive = (r: IRecord) => {
  return !r.end
}

const activeRecords = () => {
  return records.value.filter(isActive).length
}

const lastRecord = () => {
  return records.value.find(isActive)
}

const removePerson = () => {
  const record = lastRecord()
  if (record) {
    record.end = new Date()
  }
}

const getDuration = (record: IRecord) => {
  const end = record.end ? record.end : new Date()
  return (end.getTime() - record.start.getTime())
}

const calculateTime = () => {
  const time = records.value.map(getDuration).reduce((t, sum) => {
    return t + sum
  }, 0)
  return time
}

const run = () => {
  if (useRate.value) {
    stopptimer.value = (calculateTime() / 1000 / 60 / 60 * hourlyRate.value).toFixed(2) + ' ' + currencySymbol.value
  } else {
    stopptimer.value = format(calculateTime())
  }
  setTimeout(run, 30)
}

run()
</script>

<template>
  <div class="box">
    <h1 class="title" v-text="stopptimer" />
    <p class="subtitle" v-text="persons" />
    <div class="field">
      <button class="button is-primary has-text-white is-medium" @click="addPerson">
        +
      </button> &nbsp;
      <button v-if="activeRecords()" class="button is-primary has-text-white is-medium" @click="removePerson">
        -
      </button>
    </div>
    <div class="field">
    </div>
    <div class="field has-addons">
      <div class="control">
        <button class="button" :class="[useRate ? 'is-link' : undefined]" @click="useRate = !useRate">Hourly Rate</button>
      </div>
      <div class="control" v-if="useRate">
        <input v-model="hourlyRate" type="number" class="input">
      </div>
      <div class="control" v-if="useRate">
        <div class="select">
          <select v-model="currencySymbol">
            <option v-for="c in currencies" :key="c" v-text="c" />
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
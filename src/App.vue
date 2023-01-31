<template>
  <div class="card m--1 g--11">
    <h1 v-text="stopptimer" />
    <p v-text="persons" />
    <p>
      <button
        class="btn--raised"
        @click="addPerson"
      >
        +
      </button> &nbsp;
      <button
        v-if="activeRecords()"
        class="btn--raised"
        @click="removePerson"
      >
        -
      </button>
    </p>
    <p>
      <input
        id="use_rate"
        v-model="useRate"
        type="checkbox"
      ><label for="use_rate">Hourly Rate</label>
    </p>
    <p v-if="useRate">
      <input
        v-model="hourlyRate"
        type="number"
      >
      <select v-model="currencySymbol">
        <option
          v-for="c in currencies"
          :key="c"
          v-text="c"
        />
      </select>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import format from 'format-duration'
import currency from 'country-to-currency'

interface IRecord {
  start: Date,
  end?: Date
}

const currencies = Object.values(currency).filter((value, index, self) => {
  return self.indexOf(value) === index
}).sort()

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
    stopptimer.value = (calculateTime() / 1000 / 60 / 60 * hourlyRate.value).toFixed(0) + ' ' + currencySymbol.value
  } else {
    stopptimer.value = format(calculateTime())
  }
  setTimeout(run, 30)
}

run()
</script>

<style lang="scss">
@import './scss/surface_styles'
</style>

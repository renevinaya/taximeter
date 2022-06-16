<template>
  <div class="card m--1 g--11">
    <h1 v-text="stopptimer"/>
    <p v-text="persons"></p>
    <button class="btn--raised" @click="addPerson">+</button> &nbsp;
    <button class="btn--raised" @click="removePerson" v-if="activeRecords()">-</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import format from 'format-duration'

interface IRecord {
  start: Date,
  end?: Date
}

const records = ref<Array<IRecord>>([])
const stopptimer = ref('0:00:00')
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
  stopptimer.value = format(calculateTime())
  setTimeout(run, 100)
}

run()
</script>

<style lang="scss">
@import './scss/surface_styles'
</style>

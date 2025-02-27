<template>
  <div class="appointment-container">
    <img src="@/assets/icons/calendar.png" alt="Calendar Icon" class="calendar-icon"/>
    <p>On {{ dateValue }} at {{ timeValue }}</p>
  </div>
</template>

<script>
export default {
  name: 'AppointmentDate',
  props: {
    dateValue: {
      type: String,
      required: true
    },
    timeValue: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.appointment-container {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 20px;
  margin-bottom: 50px;
}

.calendar-icon {
  width: 40px; 
  height: 35px;
  margin-right: 10px;
}

.appointment-date {
  font-weight: bold;
}
</style>

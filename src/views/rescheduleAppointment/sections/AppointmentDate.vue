<template>
  <div class="appointment-container">
    <img :src="loading ? loadingGif : calendarIcon" alt="Calendar Icon" class="calendar-icon"/>
    <p>On {{ formattedDate }} at {{ formattedTime }}</p>
  </div>
</template>

<script>
import { formatDate, formatTime } from '@/utils/functions.js';
import calendarIcon from '@/assets/icons/calendar.png';
import loadingGif from '@/assets/icons/loading.gif';

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
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedDate() {
      return formatDate(this.dateValue);
    },
    formattedTime() {
      return formatTime(this.timeValue);
    }
  },
  data() {
    return {
      calendarIcon,
      loadingGif
    };
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

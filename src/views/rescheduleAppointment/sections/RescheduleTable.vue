<template>
  <div class="reschedule-table-section-container">
    <div class="bg-grey">
      <p class="bold-text medium-text">Did you have an unexpected situation?</p>
      <p class="medium-text">You can change the appointment for when it suits you better?</p>
    </div>
    <div class="reschedule-table-container">
      <table class="reschedule-table">
        <thead>
          <tr>
            <th 
              v-for="(date, index) in headersData" 
              :key="index"
              class="center-text dark-color"
            >
              {{ formatDayName(date) }}
            </th>
          </tr>
          <tr>
            <th 
              v-for="(date, index) in headersData" 
              :key="index"
              class="center-text header-text"
            >
              {{ formatShortDate(date) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, index) in visibleTimeSlots" :key="index">
            <td 
              v-for="(times, date) in filledAppointments" 
              :key="date" 
              class="time-cell"
            >
              <div 
                v-if="times.length > 0"
                class="hour-btn" 
                :class="{ disabled: !times.includes(time), selected: selectedTime === time && selectedDate === date }" 
                @click="times.includes(time) && handleTimeClick(time, date)"
              >
                <span>{{ time }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="button-container">
        <button @click="$emit('toggle-height', false), $emit('update-appointments')">
          <img src="@/assets/icons/arrow.png" alt="arrow-icon">
        </button>
      </div>
      <div class="show-more-container">
        <button @click="toggleShowMore" class="show-more-button">{{ showMoreText }}</button>
        <img :class="{ 'rotate-180': showMore }" src="@/assets/icons/chevron.png" alt="chevron-icon">
      </div>
    </div>
    
    <template v-if="!appointmentUpdated && showReschedule">
      <div class="container--confirmation-text">
        <p class="bold-text medium-text">Reschedule</p>
        <p class="medium-text">Click button to confirm</p>
      </div>
    </template>
    <button 
      v-if="selectedTime && selectedDate && !appointmentUpdated" 
      class="show-more-btn" 
      @click="bookSelectedSlot"
    >
      {{ formattedSelectedDate }} - {{ formattedSelectedTime }}
    </button>
  </div>
</template>

<script>
import { formatDate, formatTime, formatShortDate, formatDayName } from '@/utils/functions.js';

export default {
  name: 'RescheduleTable',
  props: {
    appointments: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      futureDateBase: new Date(),
      visibleRows: 6,
      maxHourOccurrences: 0,
      showMore: false,
      showReschedule: false,
      selectedTime: null,
      selectedDate: null,
      appointmentUpdated: false
    };
  },
  computed: {
    timeSlots() {
      const allTimes = new Set();
      Object.values(this.appointments).forEach(times => {
        times.forEach(time => allTimes.add(time));
      });
      return Array.from(allTimes).sort();
    },
    allTimeSlots() {
      const times = this.timeSlots;
      if (times.length === 0) return [];
      
      const minTime = times[0];
      const maxTime = times[times.length - 1];
      
      const [minHour, minMinute] = minTime.split(':').map(Number);
      const [maxHour, maxMinute] = maxTime.split(':').map(Number);
      
      const allTimes = [];
      for (let hour = minHour; hour <= maxHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          allTimes.push(time);
        }
      }
      return allTimes;
    },
    filledAppointments() {
      const filled = {};
      Object.keys(this.appointments).forEach(date => {
        const times = this.appointments[date];
        if (times.length > 0) {
          const minTime = times[0];
          const maxTime = times[times.length - 1];
          
          const [minHour, minMinute] = minTime.split(':').map(Number);
          const [maxHour, maxMinute] = maxTime.split(':').map(Number);
          
          const allTimes = [];
          for (let hour = minHour; hour <= maxHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              allTimes.push(time);
            }
          }
          filled[date] = allTimes;
        } else {
          filled[date] = [];
        }
      });
      return filled;
    },
    visibleTimeSlots() {
      return this.allTimeSlots.slice(0, this.visibleRows);
    },
    dateHeaders() {
      const today = this.futureDateBase;
      const dateHeaders = [];
      
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dateHeaders.push(nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }));
      }
      return dateHeaders;
    },
    headersData() {
      return Object.keys(this.appointments);
    },
    showMoreText() {
      return this.showMore ? 'Show Less hours' : 'Show More hours';
    },
    formattedSelectedDate() {
      return formatDate(this.selectedDate, 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    formattedSelectedTime() {
      return formatTime(this.selectedTime);
    }
  },
  methods: {
    handleTimeClick(time, date) {
      const fullDate = new Date(date);
      this.showReschedule = true;
      this.selectedTime = time;
      this.selectedDate = fullDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      this.appointmentUpdated = false;
    },
    getTimeClass(time, date) {
      return { 'selected-time': this.selectedTime === time && this.selectedDate === date };
    },
    toggleShowMore() {
      this.showMore = !this.showMore;
      this.visibleRows = this.showMore ? this.allTimeSlots.length : 6;
      this.$emit('toggle-height', this.showMore);
    },
    resetVisibleRows() {
      this.visibleRows = 6;
      this.showMore = false;
    },
    updateMaxHourOccurrences() {
      this.maxHourOccurrences = Math.max(...Object.values(this.appointments).map(times => times.length));
    },
    bookSelectedSlot() {
      this.$emit('book-slot', this.selectedDate, this.selectedTime);
      this.appointmentUpdated = true;
    },
    formatShortDate(date) {
      return formatShortDate(date);
    },
    formatDayName(date) {
      return formatDayName(date);
    }
  },
  watch: {
    appointments: {
      handler() {
        this.updateMaxHourOccurrences();
      },
      deep: true
    }
  }
}
</script>

<style>
.bg-grey {
  background-color: #f0f0f0;
}

.bold-text {
  font-weight: bold;
}

.dark-color {
  color: #333;
}	

.medium-text {
  font-size: 16px;
}

.reschedule-table-section-container {
  margin-top: 20px;
  position: relative;
}

.reschedule-table-container {
  background-color: white;
  padding: 30px;
  margin-top: 30px;
}

.container--confirmation-text {
  margin: 20px 0;
}

.reschedule-table {
  width: 100%;
  border-collapse: collapse;
}

.reschedule-table th, .reschedule-table td {
  padding: 5px;
}

.reschedule-table th {
  text-align: center;
}

.date-header {
  background-color: #e0e0e0;
  font-weight: bold;
  text-align: center;
}

.button-container {
  position: absolute;
  right: 10px;
  top: 114px;
}

.button-container img {
  width: 30px;
  height: 30px;
}

.button-container button {
  background: none;
  border: none;
  cursor: pointer;
  background-color: white;
  padding: 0 3px;
  border-radius: 50%;
}

.button-container button:hover {
  background-color: rgb(217, 233, 248);
  cursor: pointer;
}

.hour-btn {
  cursor: pointer;
  padding: 3px;
  background-color: #e6f7ff;
  color: #0056b3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  max-width: 60px;
  margin: 5px auto;
}

.hour-btn.disabled {
  background-color: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
  text-decoration: line-through;
}

.hour-btn.selected {
  background-color: #007bff;
  color: white;
}

.show-more-btn {
  width: 100%;
  margin-top: 10px;
  background-color: #007bff;
  padding: 8px 0;
  border: none;
  color: white;
}

.show-more-btn:hover {
  background-color: rgb(217, 233, 248);
  color: #007bff;
  cursor: pointer;
}

.selected-time,  .hour-btn:hover:not(.disabled) {
  background-color: #007bff;
  color: white;
}

.time-cell {
  margin: 5px;
}

.show-more-container {
  text-align: center;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid  rgb(217, 233, 248);
}

.show-more-container img {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  transition: transform 0.3s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.show-more-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.show-more-button:hover {
  text-decoration: underline;
}

.center-text {
  text-align: center;
}

.header-text {
  color: grey;
  font-size: 14px;
}
</style>

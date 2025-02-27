<template>
  <div class="reschedule-table-container">
    <p>Did you have an unexpected situation?</p>
    <p>You can change the appointment for when it suits you better?</p>

    <table class="reschedule-table">
      <thead>
        <tr>
          <th v-for="(date, index) in headersData" :key="index">{{ date }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, index) in visibleTimeSlots" :key="index">
          <td v-for="(times, date) in appointments" :key="date" class="time-cell">
            <div class="hour-btn" v-if="times.includes(time)" @click="handleTimeClick(time, date)" :class="{ 'selected-time': selectedTime === time && selectedDate === date }"><span>{{ time }}</span></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button @click="$emit('update-appointments')">Load Next 7 Days</button>
    </div>
    <div class="show-more-container">
      <button @click="toggleShowMore" class="show-more-button">{{ showMoreText }}</button>
    </div>
    <button v-if="selectedTime && selectedDate && !appointmentUpdated" class="full-width-button" @click="bookSelectedSlot">{{ selectedDate }} - {{ selectedTime }}</button>
    <template v-if="!appointmentUpdated">
      <p v-if="showReschedule">Reschedule</p>
      <p v-if="showReschedule">Click button to confirm</p>
    </template>
  </div>
</template>

<script>
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
    visibleTimeSlots() {
      return this.timeSlots.slice(0, this.visibleRows);
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
      return this.showMore ? 'Show Less' : 'Show More';
    }
  },
  methods: {
    handleTimeClick(time, date) {
      this.showReschedule = true;
      this.selectedTime = time;
      this.selectedDate = date;
    },
    toggleShowMore() {
      this.showMore = !this.showMore;
      this.visibleRows = this.showMore ? this.maxHourOccurrences : 6;
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
.reschedule-table-container {
  background-color: white;
  padding: 30px;
  margin-top: 20px;
  position: relative;
}

.reschedule-table {
  width: 100%;
  border-collapse: collapse;
}

.reschedule-table th, .reschedule-table td {
  padding: 5px;
}

.reschedule-table th {
  text-align: left;
}

.date-header {
  background-color: #e0e0e0;
  font-weight: bold;
  text-align: center;
}

.button-container {
  position: absolute;
  right: 20px;
  top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
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
}

.full-width-button {
  width: 100%;
  margin-top: 10px;
}

.selected-time {
  background-color: #007bff;
  color: white;
}

.time-cell {
  margin: 5px;
}

.show-more-container {
  text-align: center;
  margin-top: 10px;
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
</style>

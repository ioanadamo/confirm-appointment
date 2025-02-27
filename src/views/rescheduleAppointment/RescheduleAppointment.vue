<template>
  <div class="reschedule-container">
    <div class="view-container">
      <Header></Header>
      <AppointmentDate :dateValue="appointment.date" :timeValue="appointment.time"></AppointmentDate>
      <RescheduleTable :appointments="appointments" @update-appointments="updateAppointments" @book-slot="bookSlot" ref="rescheduleTable"></RescheduleTable>
    </div>
  </div>
</template>

<script>
import Header from './sections/Header.vue'
import AppointmentDate from './sections/AppointmentDate.vue'
import RescheduleTable from './sections/RescheduleTable.vue'
import fetchNextMonday from '@/utils/services.js'
import { getNextMonday, formatDateString, transformData, formatDateTime } from '@/utils/functions.js'
import { bookSlot as bookSlotService } from '@/utils/services.js'

export default {
  name: 'RescheduleAppointment',
  components: {
    Header,
    AppointmentDate,
    RescheduleTable
  },
  data() {
    return {
      appointment: {
        date: '',
        time: ''
      },
      appointments: {},
      futureDateBase: new Date(),
    };
  },
  async created() {
    this.appointment.date = '2021-08-02';
    this.appointment.time = '09:00';
    
    const today = new Date();
    this.futureDateBase = getNextMonday(today);
    
    await this.fetchAppointments(this.futureDateBase, today);
  },
  methods: {
    async fetchAppointments(futureDateBase, today) {
      try {
        const data = await fetchNextMonday(futureDateBase);
        this.appointments = transformData(data, today);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    },
    async updateAppointments() {
      try {
        const futureDateBaseFormatted = formatDateString(this.futureDateBase);
        const nextFutureMonday = getNextMonday(futureDateBaseFormatted);
        this.futureDateBase = nextFutureMonday;

        await this.fetchAppointments(this.futureDateBase, this.futureDateBase);

        this.$refs.rescheduleTable.resetVisibleRows();
        this.$refs.rescheduleTable.updateMaxHourOccurrences();
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    },
    async bookSlot(selectedDate, selectedTime) {
      const startTimestamp = formatDateTime(selectedDate, selectedTime);
      let [endHour, endMinute] = selectedTime.split(':').map(Number);
      endMinute += 30;
      if (endMinute >= 60) {
        endMinute -= 60;
        endHour += 1;
      }
      const endTimestamp = formatDateTime(selectedDate, `${endHour < 10 ? '0' + endHour : endHour}:${endMinute < 10 ? '0' + endMinute : endMinute}:00`);
      
      const payload = {
        Start: startTimestamp,
        End: endTimestamp,
        Comments: "Additional instructions for the doctor",
        Patient: {
          Name: "Patient Name",
          SecondName: "Patient SecondName",
          Email: "Patient Email",
          Phone: "Patient Phone"
        }
      };

      try {
        const response = await bookSlotService(payload);

        if (response.ok) {
          this.appointment.date = selectedDate;
          this.appointment.time = selectedTime;
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
      }
    }
  }
}
</script>

<style>
  .reschedule-container {
    background-color: #f0f0f0;
    padding: 20px;
    height: 100vh; 
  }

  .view-container {
    max-width: 1000px;
    margin: auto;
  }
</style>
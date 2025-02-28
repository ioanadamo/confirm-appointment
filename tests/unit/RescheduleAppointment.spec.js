import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RescheduleAppointment from '@/views/rescheduleAppointment/RescheduleAppointment.vue';
import { fetchNextMonday, bookSlot } from '@/utils/services.js';
import { getNextMonday, formatDateString, transformData, formatDateTime } from '@/utils/functions.js';

vi.mock('@/utils/services.js');

describe('RescheduleAppointment.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RescheduleAppointment, {
      propsData: {
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches appointments on created', async () => {
    fetchNextMonday.mockResolvedValueOnce([]);
    await wrapper.vm.$nextTick();
    expect(fetchNextMonday).toHaveBeenCalled();
  });

  it('updates appointments correctly', async () => {
    fetchNextMonday.mockResolvedValueOnce([]);
    await wrapper.vm.updateAppointments();
    expect(fetchNextMonday).toHaveBeenCalled();
  });

  it('books a slot correctly', async () => {
    bookSlot.mockResolvedValueOnce({ ok: true });
    await wrapper.vm.bookSlot('2021-08-02', '09:00');
    expect(bookSlot).toHaveBeenCalled();
    expect(wrapper.vm.appointment.date).toBe('2021-08-02');
    expect(wrapper.vm.appointment.time).toBe('09:00');
  });

  it('handles booking slot errors', async () => {
    bookSlot.mockRejectedValueOnce(new Error('Error booking appointment'));
    await wrapper.vm.bookSlot('2021-08-02', '09:00');
    expect(bookSlot).toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RescheduleTable from '@/views/rescheduleAppointment/sections/RescheduleTable.vue';

describe('RescheduleTable.vue', () => {
  let wrapper;

  beforeEach(() => {
    const appointments = {
      '2023-10-01': ['09:00', '10:00'],
      '2023-10-02': ['11:00', '12:00'],
    };
    wrapper = shallowMount(RescheduleTable, {
      propsData: { appointments }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct date headers', () => {
    const dateHeaders = wrapper.vm.dateHeaders;
    expect(dateHeaders.length).toBe(7);
  });

  it('displays the correct time slots', () => {
    const timeSlots = wrapper.vm.timeSlots;
    expect(timeSlots).toContain('09:00');
    expect(timeSlots).toContain('10:00');
    expect(timeSlots).toContain('11:00');
    expect(timeSlots).toContain('12:00');
  });

  it('updates visible rows correctly when showMore is toggled', async () => {
    expect(wrapper.vm.showMore).toBe(false);
    wrapper.vm.toggleShowMore();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showMore).toBe(true);
    expect(wrapper.vm.visibleRows).toBe(wrapper.vm.maxHourOccurrences);
  });

  it('resets visible rows correctly', async () => {
    wrapper.vm.toggleShowMore();
    await wrapper.vm.$nextTick();
    wrapper.vm.resetVisibleRows();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.visibleRows).toBe(6);
    expect(wrapper.vm.showMore).toBe(false);
  });

  it('emits "book-slot" event with correct parameters', async () => {
    wrapper.vm.handleTimeClick('09:00', '2023-10-01');
    await wrapper.vm.$nextTick();
    wrapper.vm.bookSelectedSlot();
    expect(wrapper.emitted('book-slot')).toBeTruthy();
    expect(wrapper.emitted('book-slot')[0]).toEqual(['2023-10-01', '09:00']);
  });

  it('updates max hour occurrences correctly', async () => {
    wrapper.setProps({
      appointments: {
        '2023-10-01': ['09:00', '10:00', '11:00'],
        '2023-10-02': ['11:00', '12:00'],
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.maxHourOccurrences).toBe(3);
  });
});

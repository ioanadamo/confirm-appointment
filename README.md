# **Reschedule an appointment!**

As initial data, suppose you had an appointment with **Dr. Simeon Molas** on **Friday, May 21th at 10:30**.

The available slots for the next seven days are shown, starting from today. Only a few slots are initially shown but
there is a button to “See more hours” under them. Some of the slots may be **Taken**, so they’re not available to the
patient to book.

The user could explore future weeks, but not past weeks, by using the right and left arrows on the header of the
calendar. Whenever he finds a slot he’d like to book, he just clicks on it and the appointment and confirm. If the
reschedule is successful, the date of the appointment is updated. Since the user clicks the slot until he gets an
answer, a loading spinner with crossed-out date to be changed will appear.

# **Install and start!**

Install dependencies:

```bash
npm i
```

## Dev Server

To run the dev server and open the project in a new browser tab:

```bash
npm run dev
```

## Test Server

To run the test server:

```bash
npm run test:unit
```
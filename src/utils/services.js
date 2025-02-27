export default async function fetchNextMonday(baseDate) {

  const response = await fetch(`https://draliatest.azurewebsites.net/api/availability/GetWeeklySlots/${baseDate}`);
  const data = await response.json();
  
  if (Array.isArray(data) && data.length > 0) {
    return data
  } else {
    console.error('Unexpected API response format:', data);
    return [];
  }
}

export async function bookSlot(payload) {
  try {
    const response = await fetch('https://draliatest.azurewebsites.net/api/availability/BookSlot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error booking appointment: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
}


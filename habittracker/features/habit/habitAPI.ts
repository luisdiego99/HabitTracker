export const fetchHabits = async () => {
  try {
    const response = await fetch('http://localhost:3002/habits');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

// export const fetchHabits = async () => {
//     try {
//       const response = await fetch('http://localhost:3002/habits');

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching habits:', error);
//       throw error;
//     }
//   };

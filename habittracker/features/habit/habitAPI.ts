export const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:3001/allHabits');
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
// SEGUN EL VIDEO DE LA U: 
// export const fetchHabits = async() => {
//     const response = await fetch("http://localhost:3001");
//     if(!response.ok) {
//         throw new Error("Failed to fetch habits");
//     }
//     return response.json();
// };


// src/features/habits/habitsAPI.ts

export const fetchHabits = async () => {
  const token = localStorage.getItem("token");
  console.log("Token enviado a Backend: ", token);
  const response = await fetch("http://localhost:3002/habits", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch habits");
  }

  return await response.json();
};

export const createHabit = async (title: string, description: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3002/habits", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error("Failed to create habit");
  }

  return await response.json();
};

export const deleteHabit = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3002/habits/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }

  return true;
};

export const markHabitAsDone = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3002/habits/markasdone/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark habit as done");
  }

  return await response.json();
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

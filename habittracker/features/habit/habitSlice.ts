import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Modelo de hábito
interface Habit {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  days: number;
  lastDone: string;
  lastUpdate: string;
  startedAt: string;
}

// Estado inicial
interface HabitState {
  habits: Habit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HabitState = {
  habits: [],
  status: "idle",
  error: null,
};

// Helpers para fetch con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ✅ Thunks

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3002/habits", {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener hábitos");
    return await res.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createHabit = createAsyncThunk(
  "habits/createHabit",
  async ({ title, description }: { title: string; description: string }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3002/habits", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Error al crear hábito");
      return await res.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteHabit = createAsyncThunk("habits/deleteHabit", async (id: string, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:3002/habits/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar hábito");
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const markHabitAsDone = createAsyncThunk("habits/markHabitAsDone", async (id: string, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:3002/habits/markasdone/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al marcar hábito");
    return await res.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


// ✅ Slice

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchHabits
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<Habit[]>) => {
        state.status = "succeeded";
        state.habits = action.payload;
        state.error = null;
      })
      .addCase(fetchHabits.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // createHabit
      .addCase(createHabit.fulfilled, (state, action: PayloadAction<Habit>) => {
        state.habits.push(action.payload);
      })

      // deleteHabit
      .addCase(deleteHabit.fulfilled, (state, action: PayloadAction<string>) => {
        state.habits = state.habits.filter((h) => h._id !== action.payload);
      })

      // markHabitAsDone
      .addCase(markHabitAsDone.fulfilled, (state, action: PayloadAction<{ days: number; message: string }>) => {
        // Opcional: puedes actualizar estado local si lo necesitas
        console.log(action.payload.message);
      });
  },
});

export default habitSlice.reducer;


// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { fetchHabits } from "./habitAPI";

// type Habit = {
//     id:string;
//     title: string;
//     description: string;
//     createdAt: string;
//     days: number;
//     lastDone: Date;
//     lastUpdate: Date;
//     startedAt: Date;
// }

// type HabitState = {
//     habits: Habit[];
//     status: Record<string, "idle" | "loading" | "success" | "failed">;
//     error: Record<string, string | null>;
// }

// const initialState: HabitState = {
//     habits: [],
//     status: {},
//     error: {}
// }
// export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async() => {
//     return await fetchHabits();
// });
// export const markAsDoneThunk = createAsyncThunk("habit/marAsDone", async (habitId: string, {rejectWithValue}) => {
//     const response = await fetch(`http://localhost:3002/habits/markasdone/${habitId}`, {
//         method:"PATCH",
//     });
//     const responseJson = await response.json();
//     if (!response.ok) {
//         return rejectWithValue("Failed to mark habit as done");
//     }else if (responseJson.message.toSring() === "Habit restarted") {
//         return rejectWithValue(responseJson.message);
//     }else {
//         return responseJson.message;
//     }
// });
// const habitSlice = createSlice({
//     name: "habits",
//     initialState,
//     reducers: {
//         addHabits: (state, action) => {
//             state.habits = action.payload;
//         },
//         addHabit: (state, action) => {
//             state.habits.push(action.payload);
//         },
//         removeHabit: (state, action) => {
//             state.habits = state.habits.filter(habit => habit.id !== action.payload);
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
//             state.habits = action.payload;
//         }).addCase(markAsDoneThunk.fulfilled, (state,action) => {
//             state.status[action.meta.arg] = "success";
//             state.error[action.meta.arg] = null;
//         }).addCase(markAsDoneThunk.rejected, (state,action) => {
//             state.status[action.meta.arg] = "failed";
//             state.error[action.meta.arg] = action.payload as string;
//         });
//     }
// });

// export const {addHabits, addHabit, removeHabit} = habitSlice.actions;
// export default habitSlice.reducer;
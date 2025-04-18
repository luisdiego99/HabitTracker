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

type markHabitAsDoneParams = {
    habitId: string,
    token?: string
}

type createHabitThunkParams = {
    token?: string,
    title: string, 
    description: string
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

// Thunks

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
  async ({title,description}:createHabitThunkParams, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3002/habits`, {
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

export const markHabitAsDone = createAsyncThunk("habits/markHabitAsDone", async ({habitId} : markHabitAsDoneParams, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:3002/habits/markasdone/${habitId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al marcar hábito");
    return await res.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


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

        .addCase(markHabitAsDone.fulfilled, (state, action: PayloadAction<{ 
            message: string; 
            days: number;
            _id: string;
        }>) => {
            state.status = "succeeded";
            const updatedHabit = state.habits.find(h => h._id === action.payload._id);
            if (updatedHabit) {
            updatedHabit.days = action.payload.days;
            updatedHabit.lastDone = new Date().toISOString();
            }
        })

        // markHabitAsDone
        .addCase(markHabitAsDone.pending, (state) => {
            state.status = "loading";
        })
        // .addCase(markHabitAsDone.fulfilled, (state, action) => {
        //     state.status = "succeeded";
        //     // Update the specific habit's days/lastDone if needed
        //     const updatedHabit = state.habits.find(h => h._id === action.payload._id);
        //     if (updatedHabit) {
        //     updatedHabit.days = action.payload.days;
        //     updatedHabit.lastDone = action.payload.lastDone;
        //     }
        // })
        .addCase(markHabitAsDone.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        });
  },
});

export default habitSlice.reducer;

'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "@/features/habit/habitSlice";
import { fetchRegisterUserThunk, fetchLoginUserThunk, addUser } from "@/features/user/userSlice";
import { AppDispatch, AppState } from "../Redux/store";
import Habits from "@/app/habits";
import {getCookie} from 'cookies-next';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: AppState) => state.habits.habits);
  const user = useSelector((state: AppState) => state.user.user);
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = getCookie('habitToken');
    if (token) {
      dispatch(addUser(token));
    }
    if (user){
      dispatch(fetchHabits());
    }
  }, [dispatch, user]);

  const handleLogin = () => {
    dispatch(fetchLoginUserThunk({username, password}));
  };

  const handleRegister = () => {
    dispatch(fetchRegisterUserThunk({username, password}));
  }

  // If user is logged in, show habits
  if (user) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
        <Habits />
      </div>
    );
  }

  // Show login/registration form if user is not logged in
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md text-gray-700 p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Habit Tracker</h1>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
//   return (
//     <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
//       <Habits /> {/* Ya no necesita pasar props */}
//     </div>
//   );
// }

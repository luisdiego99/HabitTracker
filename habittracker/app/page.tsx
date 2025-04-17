'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchHabits } from "@/features/habit/habitSlice";
import { AppDispatch } from "../Redux/store";
import Habits from "@/app/habits"; // No necesita props

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      <Habits /> {/* Ya no necesita pasar props */}
    </div>
  );
}

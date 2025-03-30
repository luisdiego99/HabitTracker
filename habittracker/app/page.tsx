'use client';
import Image from "next/image";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";
import { AppState, AppDispatch } from "../Redux/store";
import Habits from "@/app/habits"

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: AppState) => state.habits.habits);

  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      <Habits habits={habits} />
    </div>
  );
}


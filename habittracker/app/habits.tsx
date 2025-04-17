import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, AppState } from "../Redux/store";
import { markHabitAsDone, fetchHabits } from "@/features/habit/habitSlice";

const Habits = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { habits, status, error } = useSelector((state: AppState) => state.habits);

  const calculateProgress = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };

  const handleMarkAsDone = (habitId: string) => {
    dispatch(markHabitAsDone(habitId)).then(() => dispatch(fetchHabits()));
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Habits</h1>
      {habits.length === 0 ? (
        <p className="text-gray-600">Loading Habits...</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li className="flex items-center justify-between" key={habit._id}>
              <span className="text-black">{habit.title}</span>
              <div className="flex items-center space-x-2">
                <progress
                  className="w-24"
                  value={calculateProgress(habit.days)}
                  max="100"
                ></progress>
                <button
                  className="px-2 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-32"
                  onClick={() => handleMarkAsDone(habit._id)}
                >
                  Mark as Done
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Habits;

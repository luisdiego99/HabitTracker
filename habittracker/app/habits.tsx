import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, AppState } from "../Redux/store";
import { markHabitAsDone, fetchHabits, createHabit } from "@/features/habit/habitSlice";

// Define the Habit interface to match your backend model
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

const Habits = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { habits, status, error } = useSelector((state: AppState) => state.habits);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<string | null>(null);

  const calculateProgress = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };

  const handleMarkAsDone = (habitId: string) => {
    dispatch(markHabitAsDone({habitId})).then(() => dispatch(fetchHabits()));
  };

  const handleCreateHabit = () => {
    if (title && description) {
      dispatch(createHabit({ 
        title, 
        description,
        token: user ? user.toString() : '' 
      })).then(() => {
        setTitle('');
        setDescription('');
        dispatch(fetchHabits());
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Habit Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Habit</h2>
        <div className="space-y-3">
          <div>
            <label htmlFor="habit-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="habit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drink water"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="habit-desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              id="habit-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 8 glasses per day"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <button
            onClick={handleCreateHabit}
            disabled={!title || status === "loading"}
            className={`px-4 py-2 rounded-md text-white font-medium w-full ${
              !title || status === "loading"
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === "loading" ? "Creating..." : "Create Habit"}
          </button>
        </div>
      </div>

      {/* Habits List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Habits</h1>
        
        {status === "loading" && habits.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading your habits...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">Error: {error}</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No habits yet. Create your first one!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {habits.map((habit: Habit) => {
              const lastDoneDate = habit.lastDone ? new Date(habit.lastDone) : null;
              const isDoneToday = lastDoneDate && 
                new Date().toDateString() === lastDoneDate.toDateString();
              
              return (
                <li key={habit._id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-800 truncate">
                        {habit.title}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                      )}
                      <div className="mt-2">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-500 mr-2">
                            {habit.days} day{habit.days !== 1 ? 's' : ''}
                          </span>
                          <progress
                            value={calculateProgress(habit.days)}
                            max="100"
                            className="h-2 w-32 rounded-full overflow-hidden"
                          >
                            {calculateProgress(habit.days)}%
                          </progress>
                        </div>
                      </div>
                    </div>
                    <button
                    onClick={() => !isDoneToday && handleMarkAsDone(habit._id)}
                    disabled={Boolean(status === "loading" || isDoneToday)}
                    className={`ml-4 px-3 py-1 rounded-md text-sm font-medium ${
                      isDoneToday || status === "loading"
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isDoneToday 
                      ? "Done Today" 
                      : status === "loading" 
                        ? "Processing..." 
                        : "Mark as Done"}
                  </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Habits;
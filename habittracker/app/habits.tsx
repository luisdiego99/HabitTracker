type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  };
  
  type HabitProps = {
    habits: Habit[];
  };
  
export default function Habits({ habits }: HabitProps) {
    return (
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Habits
        </h1>
        {habits.length === 0 ? (
          <p className="text-gray-600">Loading Habits...</p>
        ) : (
          <ul className="space-y-4">
            {habits.map((habit:Habit) => (
                <li className="flex items-center justify-between" key={(habit._id)}>
                  <span className="text-black">{habit.title}</span>
                  <div className="flex items-center space-x-2">
                    <progress className="w-24" value="70" max="100"></progress>
                    <button
                      className="px-2 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-32"
                      onClick={() => {
                        console.log(`Marked "${habit.title}" as done`);
                      }}
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
  }
  

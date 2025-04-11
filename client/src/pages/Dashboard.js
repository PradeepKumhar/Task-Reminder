import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = filterDate
        ? `http://localhost:5000/api/task?dueDate=${filterDate}`
        : "http://localhost:5000/api/task";
  
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await res.json();
      if (res.ok) setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([data.task, ...tasks]);
        setNewTask({ title: "", description: "", dueDate: "" });
      } else alert(data.error || "Something went wrong");
    } catch (err) {
      console.error("Add task failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/task/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/task/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "done" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map((task) => (task._id === id ? updated.task : task)));
      }
    } catch (err) {
      console.error("Complete failed", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterDate]);

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/task/update/${editingTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingTask),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTasks(
          tasks.map((task) => (task._id === editingTask._id ? data.task : task))
        );
        setEditingTask(null);
      } else {
        const err = await res.json();
        alert(err.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">📋 Your Tasks</h2>

      <form onSubmit={handleAddTask} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

            {/* filter logic */}
            <div className="mb-6">
        <label className="block font-medium mb-2">📅 Filter by Due Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="ml-4 text-sm text-blue-600 underline rounded-sm p-1 hover:bg-blue-500 hover:text-white"
          >
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-400">
                  Due: {task.dueDate?.slice(0, 10)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    task.status === "done"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {task.status}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleComplete(task._id)}
                  className="text-green-600 hover:underline"
                >
                  ✔️
                </button>
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️
                </button>
              </div>
              {editingTask && (
                <form
                  onSubmit={(e) => handleUpdateTask(e)}
                  className="space-y-4 mb-8 border-t pt-4"
                >
                  <h3 className="text-xl font-semibold">✏️ Edit Task</h3>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                    required
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded"
                    required
                  />
                  <input
                    type="date"
                    value={editingTask.dueDate?.slice(0, 10)}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

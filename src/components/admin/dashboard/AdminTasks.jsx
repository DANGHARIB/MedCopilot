import React, { useState } from 'react';
import { CheckCircle, PlusCircle, Clock } from 'lucide-react';
import './AdminTasks.css';

// eslint-disable-next-line no-unused-vars
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="section-title-container">
    <h2 className="section-title">
      <Icon size={20} className="section-title-icon" />
      {title}
    </h2>
  </div>
);

const TaskItem = ({ task, completed, onToggle }) => (
  <div className="task-item">
    <input 
      type="checkbox" 
      id={`task-${task.id}`} 
      checked={completed} 
      onChange={onToggle} 
    />
    <label 
      htmlFor={`task-${task.id}`} 
      className={completed ? 'completed' : ''}
    >
      {task.text}
    </label>
    <span className="task-due">
      <Clock size={14} />
      {task.due}
    </span>
  </div>
);

const AdminTasks = () => {
  // Initial tasks data
  const initialTasks = [
    { id: 1, text: "Review new school applications", due: "Today", completed: false },
    { id: 2, text: "Update AI agent training data", due: "Tomorrow", completed: true },
    { id: 3, text: "Prepare monthly analytics report", due: "May 20", completed: false },
    { id: 4, text: "Plan summer webinar series", due: "May 25", completed: false }
  ];

  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="dashboard-section admin-tasks-section">
      <SectionTitle icon={CheckCircle} title="Admin Tasks" />
      
      <div className="task-list">
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            completed={task.completed}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </div>
      
      <button className="dashboard-action-button">
        <PlusCircle size={16} />
        Add New Task
      </button>
    </div>
  );
};

export default AdminTasks;
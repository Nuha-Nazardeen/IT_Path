import { useState } from 'react';

interface Task {
  id: string;
  name: string;
  meta: string;
  points: number;
  completed: boolean;
  icon: string;
}

interface RoadmapItem {
  id: string;
  name: string;
  status: 'done' | 'current' | 'future';
}

export function DashboardPreview() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      name: 'Database Systems Assignment',
      meta: 'Due in 2 days • 40% of grade',
      points: 18,
      completed: false,
      icon: '🎓'
    },
    {
      id: 'task-2',
      name: 'Complete Node.js Module',
      meta: 'Career Path: Backend Eng • 45m left',
      points: 14,
      completed: false,
      icon: '💻'
    }
  ]);

  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([
    { id: 'rm-1', name: 'Git & Version Control', status: 'done' },
    { id: 'rm-2', name: 'RESTful APIs', status: 'current' },
    { id: 'rm-3', name: 'PostgreSQL', status: 'future' }
  ]);

  const baseScore = 68;
  const currentScore = baseScore + tasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0);

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleRoadmap = (itemId: string) => {
    setRoadmap(prevRoadmap =>
      prevRoadmap.map(item => {
        if (item.id === itemId) {
          const nextStatus = item.status === 'done' ? 'current' : item.status === 'current' ? 'future' : 'done';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="hero-visual">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="user-greeting">Good morning, Jordan</div>
              <div className="user-sub">BSc Computer Science • Year 2</div>
            </div>
          </div>
          <span className="focus-badge">Focus: Backend</span>
        </div>

        <div className="dashboard-grid">
          {/* Today's Focus Card */}
          <div className="sub-card">
            <div className="card-title">Today's Focus</div>
            <div className="tasks-list">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  title="Click to toggle status"
                >
                  <div className="task-icon-wrapper">
                    {task.completed ? '✓' : task.icon}
                  </div>
                  <div className="task-details">
                    <span className="task-name">{task.name}</span>
                    <span className="task-meta">{task.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Card */}
          <div className="sub-card">
            <div className="card-title">Roadmap: Backend</div>
            <div className="roadmap-list">
              {roadmap.map(item => (
                <div 
                  key={item.id} 
                  className={`roadmap-item ${item.status}`}
                  onClick={() => toggleRoadmap(item.id)}
                  title="Click to toggle milestone state"
                >
                  <div className="roadmap-dot"></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="score-card">
          <div className="score-info">
            <div className="score-title">Career Readiness Score</div>
            <div className="score-number">
              {currentScore}
              <span className="score-total">/100</span>
            </div>
          </div>
          <div className="score-chart-container">
            <svg className="score-svg" viewBox="0 0 36 36">
              <circle className="bg-circle" cx="18" cy="18" r="16" />
              <circle 
                className="fg-circle" 
                cx="18" 
                cy="18" 
                r="16" 
                strokeDasharray="100, 100" 
                strokeDashoffset={100 - currentScore}
              />
            </svg>
            <span className="score-arrow">↗</span>
          </div>
        </div>
      </div>

      <div className="flow-pill">
        <span>University</span>
        <span>Career</span>
        <span>Portfolio</span>
      </div>
    </div>
  );
}

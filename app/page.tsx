"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
};

type StatusBand = {
  label: string;
  tone: string;
  message: string;
};

const DEFAULT_TASKS = [
  "Plan the mission",
  "Set the structure",
  "Build the core",
  "Test the flow",
  "Deploy or finish"
];

function getStatusBand(progress: number): StatusBand {
  if (progress === 100) {
    return {
      label: "MISSION COMPLETE",
      tone: "gold",
      message: "Objective achieved. Clean work. Close the loop and claim the win."
    };
  }

  if (progress >= 80) {
    return {
      label: "FINAL PUSH",
      tone: "pink",
      message: "You are near the summit. Do not drift now. Close strong."
    };
  }

  if (progress >= 60) {
    return {
      label: "MOMENTUM",
      tone: "violet",
      message: "The engine is humming. Keep stacking completions."
    };
  }

  if (progress >= 40) {
    return {
      label: "LOCKED IN",
      tone: "cyan",
      message: "Focus is stable. Execution is sharper than emotion."
    };
  }

  if (progress >= 20) {
    return {
      label: "ENGAGED",
      tone: "emerald",
      message: "The mission is alive. Keep feeding it with clean actions."
    };
  }

  return {
    label: "BOOTING",
    tone: "sky",
    message: "System waking. Pick the first win and make the day obey."
  };
}

function getToneClass(tone: string) {
  switch (tone) {
    case "gold":
      return "tone-gold";
    case "pink":
      return "tone-pink";
    case "violet":
      return "tone-violet";
    case "cyan":
      return "tone-cyan";
    case "emerald":
      return "tone-emerald";
    case "sky":
    default:
      return "tone-sky";
  }
}

export default function Page() {
  const [mission, setMission] = useState("Ship a product");
  const [deadline, setDeadline] = useState("Today");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>(
    DEFAULT_TASKS.map((text, i) => ({
      id: i + 1,
      text,
      done: i === 0 ? true : false
    }))
  );
  const [streak, setStreak] = useState(4);
  const [notes, setNotes] = useState("Move fast. Stay clean. Finish what matters.");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aistatus-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          mission: string;
          deadline: string;
          taskInput: string;
          tasks: Task[];
          streak: number;
          notes: string;
        };

        setMission(parsed.mission || "Ship a product");
        setDeadline(parsed.deadline || "Today");
        setTaskInput(parsed.taskInput || "");
        setTasks(
          parsed.tasks?.length
            ? parsed.tasks
            : DEFAULT_TASKS.map((text, i) => ({
                id: i + 1,
                text,
                done: i === 0 ? true : false
              }))
        );
        setStreak(typeof parsed.streak === "number" ? parsed.streak : 4);
        setNotes(parsed.notes || "Move fast. Stay clean. Finish what matters.");
      } catch {
        // Ignore corrupted storage.
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "aistatus-state",
      JSON.stringify({
        mission,
        deadline,
        taskInput,
        tasks,
        streak,
        notes
      })
    );
  }, [mission, deadline, taskInput, tasks, streak, notes, hydrated]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks]
  );

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedCount / tasks.length) * 100);
  }, [completedCount, tasks.length]);

  const xp = useMemo(() => completedCount * 25 + (progress === 100 ? 100 : 0), [completedCount, progress]);

  const level = useMemo(() => {
    return Math.max(1, Math.floor(xp / 100) + 1);
  }, [xp]);

  const remaining = useMemo(() => tasks.length - completedCount, [tasks.length, completedCount]);

  const statusBand = useMemo(() => getStatusBand(progress), [progress]);

  const liveUpdate = useMemo(() => {
    if (progress === 100) {
      return `AIStatus Report: Mission complete. "${mission}" has been closed successfully. You hit every required stage and finished the loop.`;
    }

    if (progress >= 80) {
      return `AIStatus Report: "${mission}" is in the final stretch. ${remaining} stage${remaining === 1 ? "" : "s"} remain. Push through with precision.`;
    }

    if (progress >= 60) {
      return `AIStatus Report: Momentum is strong. "${mission}" is advancing well. Protect your rhythm and finish the heavy lifts first.`;
    }

    if (progress >= 40) {
      return `AIStatus Report: You are locked in. Half the fog is gone. Keep converting intention into checkmarks.`;
    }

    if (progress >= 20) {
      return `AIStatus Report: Mission engaged. Early traction detected. Build confidence by clearing the next step.`;
    }

    return `AIStatus Report: Systems booting for "${mission}". Start with one meaningful action and let momentum compound.`;
  }, [mission, progress, remaining]);

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function addTask() {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        text: trimmed,
        done: false
      }
    ]);
    setTaskInput("");
  }

  function removeTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function resetMission() {
    setMission("New Mission");
    setDeadline("Today");
    setTaskInput("");
    setTasks(
      DEFAULT_TASKS.map((text, i) => ({
        id: Date.now() + i,
        text,
        done: false
      }))
    );
    setNotes("Fresh mission. New loop. Start clean.");
  }

  function completeMission() {
    setTasks((current) => current.map((task) => ({ ...task, done: true })));
    setStreak((s) => s + 1);
  }

  return (
    <main className="page-shell">
      <div className="bg-orb bg-orb-one" />
      <div className="bg-orb bg-orb-two" />
      <div className="grid-overlay" />

      <section className="app-wrap">
        <header className="hero-card">
          <div className="hero-topline">
            <span className="eyebrow">VOLTARA DISTRICT</span>
            <span className="dot" />
            <span className="eyebrow soft">PRODUCTIVITY ENGINE</span>
          </div>

          <h1 className="title">AIStatus</h1>
          <p className="subtitle">
            Turn goals into staged missions. Tick them off. Let the system rate your day as it unfolds.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-label">Mission Progress</span>
              <strong className="stat-value">{progress}%</strong>
            </div>
            <div className="stat">
              <span className="stat-label">XP</span>
              <strong className="stat-value">{xp}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Level</span>
              <strong className="stat-value">{level}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Streak</span>
              <strong className="stat-value">{streak}d</strong>
            </div>
          </div>
        </header>

        <section className="dashboard">
          <div className="panel panel-main">
            <div className="panel-head">
              <h2>Mission Control</h2>
              <span className={`status-pill ${getToneClass(statusBand.tone)}`}>
                {statusBand.label}
              </span>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Mission</span>
                <input
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Ship a product"
                />
              </label>

              <label className="field">
                <span>Deadline</span>
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Today"
                />
              </label>
            </div>

            <div className="progress-block">
              <div className="progress-row">
                <span>Completion</span>
                <span>{completedCount}/{tasks.length} goals</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-copy">{statusBand.message}</p>
            </div>

            <div className="task-entry">
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                placeholder="Add a stage or goal..."
              />
              <button onClick={addTask}>Add Goal</button>
            </div>

            <div className="tasks">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  No mission stages yet. Add one and let the machine breathe.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className={`task ${task.done ? "task-done" : ""}`}>
                    <button
                      className={`check ${task.done ? "check-on" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={`Toggle ${task.text}`}
                    >
                      {task.done ? "✓" : ""}
                    </button>

                    <div className="task-copy">
                      <span>{task.text}</span>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeTask(task.id)}
                      aria-label={`Remove ${task.text}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={completeMission}>
                Complete Mission
              </button>
              <button className="btn btn-secondary" onClick={resetMission}>
                Reset
              </button>
            </div>
          </div>

          <div className="panel panel-side">
            <div className="mini-card">
              <div className="mini-head">
                <h3>AIStatus Update</h3>
                <span className="mini-tag">Live</span>
              </div>
              <p className="report">{liveUpdate}</p>
            </div>

            <div className="mini-card">
              <div className="mini-head">
                <h3>Daily Notes</h3>
                <span className="mini-tag">Editable</span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add strategic notes..."
              />
            </div>

            <div className="mini-card">
              <div className="mini-head">
                <h3>Session Stats</h3>
                <span className="mini-tag">Realtime</span>
              </div>
              <div className="session-stats">
                <div className="session-row">
                  <span>Goals Completed</span>
                  <strong>{completedCount}</strong>
                </div>
                <div className="session-row">
                  <span>Goals Remaining</span>
                  <strong>{remaining}</strong>
                </div>
                <div className="session-row">
                  <span>Mission Deadline</span>
                  <strong>{deadline || "—"}</strong>
                </div>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-head">
                <h3>System State</h3>
                <span className="mini-tag">Operational</span>
              </div>
              <ul className="system-list">
                <li>Mission memory saved locally</li>
                <li>Status changes with progress</li>
                <li>Gamified XP and level tracking</li>
                <li>Fast mobile-first interaction</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
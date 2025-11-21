import React from "react";
import "./GradeSidebar.css";

export default function GradeSidebar({ grades, selectedGrade, onSelectGrade }) {
  return (
    <aside className="grade-sidebar slide-in-left">
      <h3 className="grade-title">GRADES</h3>

      <ul className="grade-list">
        {grades.map((g) => (
          <li key={g}>
            <button
              className={
                "grade-btn " +
                (selectedGrade === g ? "grade-btn-active" : "")
              }
              onClick={() => onSelectGrade(g)}
            >
              Grade {g}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

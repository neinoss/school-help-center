import React from "react";

export default function SubjectCard({ title, description, image, examples, grade }) {
  return (
    <div className="card">
      <h2>{title} — {grade}</h2>
      <p>{description}</p>
      <img src={image} alt={title} />

      <ul>
        {examples.map((ex, i) => (
          <li key={i}>{ex}</li>
        ))}
      </ul>
    </div>
  );
}

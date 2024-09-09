// page.js
"use client";
import { useState } from "react";
import Quiz from "../Components/Quiz";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="container mt-5 ml-5">
      <div className="text-center">
        <h1 className="text-success mtb-1 ">Econ 21003</h1>
        <h3 className="mb-4">Quiz 1</h3>
      </div>

      {quizStarted ? (
        <Quiz name={name} />
      ) : (
        <>
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">
              Enter Your Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            onClick={() => setQuizStarted(true)}
            className="btn btn-primary"
            // Disable button if name is empty or whitespace
            disabled={!name.trim()}
          >
            Start Quiz
          </button>
        </>
      )}
    </div>
  );
}

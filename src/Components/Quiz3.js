import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { quiz } from "../Data/QuestionSet.js";
import ScoreCard from "./ScoreCard.js";
import jsPDF from "jspdf";

const Quiz = ({ name }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [userAnswers, setUserAnswers] = useState([]);

  const questions = quiz.questions;
  const { question, answers, correctAnswer } = questions[currentQuestionIndex];

  const onAnswerSelected = (answer, idx) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    setAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === correctAnswer) {
      setQuizResult((prev) => ({
        ...prev,
        score: prev.score + 5,
        correctAnswers: prev.correctAnswers + 1,
      }));
    } else {
      setQuizResult((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }

    setUserAnswers((prev) => [
      ...prev,
      { question: currentQuestionIndex + 1, answer: selectedAnswer },
    ]);

    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
    setSelectedAnswer("");
    setSelectedAnswerIndex(null);
    setAnswerChecked(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
      setAnswerChecked(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Quiz Results for ${name}`, 10, 10);
    userAnswers.forEach((item, index) => {
      doc.text(
        `Question ${item.question}: ${item.answer}`,
        10,
        20 + index * 10
      );
    });
    doc.save("quiz_results.pdf");
  };

  return (
    <div className="container mt-5">
      <div>
        {!showResults ? (
          <div className="card p-4">
            <h4>{question}</h4>
            <ul className="list-group">
              {answers.map((answer, idx) => (
                <li
                  key={idx}
                  onClick={() => onAnswerSelected(answer, idx)}
                  className={
                    "list-group-item " +
                    (selectedAnswerIndex === idx ? "active" : "") +
                    " cursor-pointer"
                  }
                >
                  {answer}
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between mt-3">
              <button
                onClick={handlePreviousQuestion}
                className="btn btn-secondary"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <b>
                Question {currentQuestionIndex + 1}/{questions.length}
              </b>
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary"
                disabled={!answerChecked}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next Question"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <ScoreCard
              quizResult={quizResult}
              questions={questions}
              name={name}
            />
            <button onClick={generatePDF} className="btn btn-success mt-3">
              Download Results as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

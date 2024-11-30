import React, { useState } from "react";

interface ModalProps {
  question: string;
  correctAnswer: number;
  onClose: () => void;
  onCorrectAnswer: () => void;
}

const QuestionModal: React.FC<ModalProps> = ({
  question,
  correctAnswer,
  onClose,
  onCorrectAnswer,
}) => {
  const [answer, setAnswer] = useState<number | string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (parseInt(answer.toString()) === correctAnswer) {
      onCorrectAnswer();
      onClose();
    } else {
      alert("Incorrect answer, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="w-1/4 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl">Solve the Question</h2>
        <p className="mb-4 text-lg">{question}</p>
        <input
          type="text"
          value={answer}
          onChange={handleChange}
          className="mb-6 w-full rounded-lg border p-3 text-lg"
          placeholder="Your answer"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#3a5b22] px-6 py-2 text-white transition hover:bg-[#034605]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;

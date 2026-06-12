import React, { FC, useState } from "react";
import {
  useGetQuizzesByCourseQuery,
  useGetQuizAttemptsQuery,
  useSubmitQuizAttemptMutation,
} from "@/redux/features/quiz/quizApi";
import toast from "react-hot-toast";

type Props = {
  courseId: string;
};

const CourseQuizzes: FC<Props> = ({ courseId }) => {
  const { data, isLoading } = useGetQuizzesByCourseQuery(courseId);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  if (isLoading) {
    return <div className="p-5 text-center text-gray-500">Loading quizzes...</div>;
  }

  const quizzes = data?.quizzes || [];

  if (quizzes.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No quizzes are available for this course yet.
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <QuizRunner
        quiz={activeQuiz}
        onBack={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz: any) => (
        <div key={quiz._id} className="p-5 border border-gray-200 dark:border-[#ffffff1d] rounded-xl bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">{quiz.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
            <p className="text-xs text-gray-400 mt-2">Passing marks: {quiz.passingMarks}% • {quiz.questions?.length} Questions</p>
          </div>
          <button
            onClick={() => setActiveQuiz(quiz)}
            className="px-6 py-2 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Attempt
          </button>
        </div>
      ))}
    </div>
  );
};

const QuizRunner = ({ quiz, onBack }: { quiz: any; onBack: () => void }) => {
  const { data: attemptData, refetch } = useGetQuizAttemptsQuery(quiz._id);
  const [submitAttempt, { isLoading }] = useSubmitQuizAttemptMutation();
  const [responses, setResponses] = useState<{ questionId: string; selectedOptionIndex: number }[]>([]);
  const [isTaking, setIsTaking] = useState(false);

  const attempts = attemptData?.attempts || [];
  const bestAttempt = attempts.reduce((prev: any, current: any) => (prev.score > current.score ? prev : current), { score: -1 });

  const handleSelectOption = (questionId: string, index: number) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.questionId === questionId);
      if (existing) {
        return prev.map((r) => (r.questionId === questionId ? { ...r, selectedOptionIndex: index } : r));
      }
      return [...prev, { questionId, selectedOptionIndex: index }];
    });
  };

  const handleSubmit = async () => {
    if (responses.length < quiz.questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    try {
      await submitAttempt({ quizId: quiz._id, responses }).unwrap();
      toast.success("Quiz submitted!");
      setIsTaking(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit quiz");
    }
  };

  if (!isTaking) {
    return (
      <div className="p-5 border border-gray-200 dark:border-[#ffffff1d] rounded-xl">
        <button onClick={onBack} className="text-sm text-[#37a39a] mb-4 hover:underline">← Back to quizzes</button>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{quiz.title}</h2>
        <p className="text-gray-500 mb-6">{quiz.description}</p>
        
        {attempts.length > 0 && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
            <h4 className="font-semibold text-black dark:text-white mb-2">Your Attempts</h4>
            <p className="text-sm">Best Score: <span className={bestAttempt.passed ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{bestAttempt.score.toFixed(1)}%</span></p>
            <p className="text-xs text-gray-400 mt-1">Passing requirement: {quiz.passingMarks}%</p>
          </div>
        )}

        <button onClick={() => { setIsTaking(true); setResponses([]); }} className="px-6 py-2 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90">
          {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 dark:border-[#ffffff1d] rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">{quiz.title}</h2>
        <button onClick={() => setIsTaking(false)} className="text-sm text-red-500 hover:underline">Cancel Attempt</button>
      </div>
      
      <div className="space-y-8">
        {quiz.questions.map((q: any, i: number) => (
          <div key={q._id}>
            <p className="font-semibold text-black dark:text-white mb-3">{i + 1}. {q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt: string, optIndex: number) => {
                const isSelected = responses.find((r) => r.questionId === q._id)?.selectedOptionIndex === optIndex;
                return (
                  <button
                    key={optIndex}
                    onClick={() => handleSelectOption(q._id, optIndex)}
                    className={`w-full text-left p-3 rounded-lg border transition ${isSelected ? "border-[#37a39a] bg-[#37a39a]/10 text-[#37a39a]" : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-black dark:text-white"}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#ffffff1d] text-right">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold ${isLoading ? 'opacity-50' : 'hover:opacity-90'}`}
        >
          {isLoading ? "Submitting..." : "Submit Answers"}
        </button>
      </div>
    </div>
  );
};

export default CourseQuizzes;

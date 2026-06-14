import React, { FC, useState, useEffect } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import {
  useGetQuizzesByCourseQuery,
  useCreateQuizMutation,
  useEditQuizMutation,
  useDeleteQuizMutation,
} from "@/redux/features/quiz/quizApi";
import toast from "react-hot-toast";

const TeacherQuizzes: FC = () => {
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  const teacherCourses = coursesData?.course || coursesData?.courses || [];

  const { data: quizzesData, isLoading: quizzesLoading, refetch } = useGetQuizzesByCourseQuery(selectedCourseId, {
    skip: !selectedCourseId,
  });

  const [deleteQuiz] = useDeleteQuizMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(id).unwrap();
        toast.success("Quiz deleted");
        refetch();
      } catch (e: any) {
        toast.error(e.data?.message || "Error deleting quiz");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white text-black">Manage Course Quizzes</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 dark:text-white text-black">Select Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full sm:w-[400px] p-2 border rounded-lg bg-transparent dark:text-white text-black"
        >
          <option value="" className="dark:bg-slate-800">-- Select Course --</option>
          {teacherCourses.map((c: any) => (
            <option key={c._id} value={c._id} className="dark:bg-slate-800">{c.name}</option>
          ))}
        </select>
      </div>

      {selectedCourseId && !isCreating && !editingQuiz && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white text-black">Quizzes</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-[#37a39a] text-white rounded-lg"
            >
              + Create Quiz
            </button>
          </div>

          {quizzesLoading ? (
            <p className="dark:text-white text-black">Loading quizzes...</p>
          ) : (
            <div className="space-y-3">
              {quizzesData?.quizzes?.length === 0 && <p className="text-gray-500">No quizzes found.</p>}
              {quizzesData?.quizzes?.map((quiz: any) => (
                <div key={quiz._id} className="p-4 border rounded-lg flex justify-between items-center dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div>
                    <h3 className="font-bold dark:text-white text-black">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.questions?.length || 0} Questions • Passing: {quiz.passingMarks}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingQuiz(quiz)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(quiz._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(isCreating || editingQuiz) && (
        <QuizForm
          courseId={selectedCourseId}
          initialData={editingQuiz}
          onClose={() => { setIsCreating(false); setEditingQuiz(null); refetch(); }}
        />
      )}
    </div>
  );
};

const QuizForm = ({ courseId, initialData, onClose }: any) => {
  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [editQuiz, { isLoading: isEditing }] = useEditQuizMutation();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [passingMarks, setPassingMarks] = useState(initialData?.passingMarks || 50);
  const [questions, setQuestions] = useState<any[]>(initialData?.questions || []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      toast.error("Quiz title is required.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }
    if (passingMarks < 1 || passingMarks > 100) {
      toast.error("Passing marks must be between 1 and 100.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text || q.text.trim() === "") {
        toast.error(`Question ${i + 1} text is required.`);
        return;
      }
      const validOptions = q.options.filter((opt: string) => opt.trim() !== "");
      if (validOptions.length < 2) {
        toast.error(`Question ${i + 1} must have at least two non-empty options.`);
        return;
      }
      if (q.options[q.correctOptionIndex]?.trim() === "") {
        toast.error(`Question ${i + 1}'s correct option cannot be an empty option.`);
        return;
      }
    }

    try {
      if (initialData) {
        await editQuiz({ quizId: initialData._id, body: { title, description, passingMarks, questions } }).unwrap();
        toast.success("Quiz updated");
      } else {
        await createQuiz({ courseId, title, description, passingMarks, questions }).unwrap();
        toast.success("Quiz created");
      }
      onClose();
    } catch (e: any) {
      toast.error(e.data?.message || "Failed to save quiz");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white text-black">{initialData ? "Edit Quiz" : "Create Quiz"}</h2>
        <button type="button" onClick={onClose} className="text-red-500 hover:underline">Cancel</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm dark:text-white text-black mb-1">Title</label>
          <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
        </div>
        <div>
          <label className="block text-sm dark:text-white text-black mb-1">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
        </div>
        <div>
          <label className="block text-sm dark:text-white text-black mb-1">Passing Marks (%)</label>
          <input required type="number" min="1" max="100" value={passingMarks} onChange={(e) => setPassingMarks(Number(e.target.value))} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold dark:text-white text-black">Questions</h3>
            <button type="button" onClick={handleAddQuestion} className="px-3 py-1 bg-[#37a39a] text-white rounded text-sm">+ Add Question</button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="mb-6 p-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800">
              <div className="flex justify-between mb-2">
                <span className="font-semibold dark:text-white text-black">Q{qIdx + 1}</span>
                <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="text-red-500 text-xs">Remove</button>
              </div>
              <input required placeholder="Question text" type="text" value={q.text} onChange={(e) => handleQuestionChange(qIdx, "text", e.target.value)} className="w-full p-2 mb-3 border rounded bg-transparent dark:text-white text-black" />
              
              <div className="space-y-2">
                {q.options.map((opt: string, optIdx: number) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input type="radio" name={`correct-${qIdx}`} checked={q.correctOptionIndex === optIdx} onChange={() => handleQuestionChange(qIdx, "correctOptionIndex", optIdx)} className="w-4 h-4 cursor-pointer" />
                    <input required placeholder={`Option ${optIdx + 1}`} type="text" value={opt} onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)} className="flex-1 p-1 border rounded bg-transparent dark:text-white text-black text-sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isCreating || isEditing} className="w-full py-2 bg-[#37a39a] text-white rounded-lg mt-4 disabled:opacity-50">
          {isCreating || isEditing ? "Saving..." : "Save Quiz"}
        </button>
      </div>
    </form>
  );
};

export default TeacherQuizzes;

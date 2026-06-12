import React, { FC, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import {
  useGetAssignmentsByCourseQuery,
  useCreateAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAllSubmissionsForAssignmentQuery,
  useGradeAssignmentMutation,
} from "@/redux/features/assignment/assignmentApi";
import toast from "react-hot-toast";

const TeacherAssignments: FC = () => {
  const { data: coursesData } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<any>(null);

  const teacherCourses = coursesData?.course || coursesData?.courses || [];

  const { data: assignmentsData, isLoading: assignmentsLoading, refetch } = useGetAssignmentsByCourseQuery(selectedCourseId, {
    skip: !selectedCourseId,
  });

  const [deleteAssignment] = useDeleteAssignmentMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id).unwrap();
        toast.success("Assignment deleted");
        refetch();
      } catch (e: any) {
        toast.error(e.data?.message || "Error deleting assignment");
      }
    }
  };

  if (viewingSubmissionsFor) {
    return <SubmissionsViewer assignment={viewingSubmissionsFor} onBack={() => setViewingSubmissionsFor(null)} />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white text-black">Manage Course Assignments</h1>
      
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

      {selectedCourseId && !isCreating && !editingAssignment && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white text-black">Assignments</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-[#37a39a] text-white rounded-lg"
            >
              + Create Assignment
            </button>
          </div>

          {assignmentsLoading ? (
            <p className="dark:text-white text-black">Loading assignments...</p>
          ) : (
            <div className="space-y-3">
              {assignmentsData?.assignments?.length === 0 && <p className="text-gray-500">No assignments found.</p>}
              {assignmentsData?.assignments?.map((assignment: any) => (
                <div key={assignment._id} className="p-4 border rounded-lg flex justify-between items-center dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div>
                    <h3 className="font-bold dark:text-white text-black">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.totalMarks} Marks</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewingSubmissionsFor(assignment)} className="px-3 py-1 bg-green-500 text-white rounded">Submissions</button>
                    <button onClick={() => setEditingAssignment(assignment)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(assignment._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(isCreating || editingAssignment) && (
        <AssignmentForm
          courseId={selectedCourseId}
          initialData={editingAssignment}
          onClose={() => { setIsCreating(false); setEditingAssignment(null); refetch(); }}
        />
      )}
    </div>
  );
};

const AssignmentForm = ({ courseId, initialData, onClose }: any) => {
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [editAssignment, { isLoading: isEditing }] = useEditAssignmentMutation();

  const [title, setTitle] = useState(initialData?.title || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "");
  const [totalMarks, setTotalMarks] = useState(initialData?.totalMarks || 100);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || !instructions || !dueDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (initialData) {
        await editAssignment({ assignmentId: initialData._id, body: { title, instructions, dueDate, totalMarks } }).unwrap();
        toast.success("Assignment updated");
      } else {
        await createAssignment({ courseId, title, instructions, dueDate, totalMarks }).unwrap();
        toast.success("Assignment created");
      }
      onClose();
    } catch (e: any) {
      toast.error(e.data?.message || "Failed to save assignment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white text-black">{initialData ? "Edit Assignment" : "Create Assignment"}</h2>
        <button type="button" onClick={onClose} className="text-red-500 hover:underline">Cancel</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm dark:text-white text-black mb-1">Title</label>
          <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
        </div>
        <div>
          <label className="block text-sm dark:text-white text-black mb-1">Instructions</label>
          <textarea required rows={5} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm dark:text-white text-black mb-1">Due Date</label>
            <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
          </div>
          <div className="flex-1">
            <label className="block text-sm dark:text-white text-black mb-1">Total Marks</label>
            <input required type="number" min="1" value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
          </div>
        </div>

        <button type="submit" disabled={isCreating || isEditing} className="w-full py-2 bg-[#37a39a] text-white rounded-lg mt-4 disabled:opacity-50">
          {isCreating || isEditing ? "Saving..." : "Save Assignment"}
        </button>
      </div>
    </form>
  );
};

const SubmissionsViewer = ({ assignment, onBack }: any) => {
  const { data, isLoading, refetch } = useGetAllSubmissionsForAssignmentQuery(assignment._id);
  const [gradeAssignment] = useGradeAssignmentMutation();
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [marks, setMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const submissions = data?.submissions || [];

  const handleSaveGrade = async (subId: string) => {
    try {
      await gradeAssignment({ submissionId: subId, body: { marks, feedback } }).unwrap();
      toast.success("Grade saved");
      setGradingSubId(null);
      refetch();
    } catch (e: any) {
      toast.error(e.data?.message || "Failed to grade");
    }
  };

  return (
    <div className="p-8">
      <button onClick={onBack} className="text-sm text-[#37a39a] mb-4 hover:underline">← Back to assignments</button>
      <h2 className="text-xl font-bold dark:text-white text-black mb-2">Submissions: {assignment.title}</h2>
      <p className="text-gray-500 mb-6">Total Marks: {assignment.totalMarks}</p>

      {isLoading ? (
        <p className="dark:text-white text-black">Loading submissions...</p>
      ) : (
        <div className="space-y-4">
          {submissions.length === 0 && <p className="text-gray-500">No submissions yet.</p>}
          {submissions.map((sub: any) => (
            <div key={sub._id} className="p-4 border rounded-lg dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold dark:text-white text-black">{sub.userId?.name}</h4>
                  <p className="text-xs text-gray-500">{sub.userId?.email} • Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  <p className="text-xs font-semibold mt-1">Status: <span className={sub.status === "graded" ? "text-green-500" : "text-orange-500"}>{sub.status.toUpperCase()}</span></p>
                </div>
                {sub.status === "graded" && gradingSubId !== sub._id && (
                  <button onClick={() => { setGradingSubId(sub._id); setMarks(sub.marks); setFeedback(sub.feedback || ""); }} className="px-3 py-1 text-sm bg-gray-200 dark:bg-slate-700 text-black dark:text-white rounded">Edit Grade</button>
                )}
                {sub.status === "pending" && gradingSubId !== sub._id && (
                  <button onClick={() => { setGradingSubId(sub._id); setMarks(0); setFeedback(""); }} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Grade Now</button>
                )}
              </div>

              <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded text-sm dark:text-gray-300 text-gray-700 whitespace-pre-wrap">
                {sub.submissionText || "No text submission."}
                {sub.submissionFileUrl && (
                  <div className="mt-2">
                    <a href={sub.submissionFileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Attached File</a>
                  </div>
                )}
              </div>

              {gradingSubId === sub._id ? (
                <div className="mt-4 p-4 border-t dark:border-slate-700">
                  <div className="flex gap-4 mb-3">
                    <div className="w-1/4">
                      <label className="block text-xs mb-1 dark:text-white text-black">Marks</label>
                      <input type="number" max={assignment.totalMarks} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs mb-1 dark:text-white text-black">Feedback</label>
                      <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white text-black" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setGradingSubId(null)} className="px-3 py-1 text-sm text-red-500">Cancel</button>
                    <button onClick={() => handleSaveGrade(sub._id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded">Save Grade</button>
                  </div>
                </div>
              ) : sub.status === "graded" && (
                <div className="mt-2 text-sm">
                  <p className="font-semibold text-green-600 dark:text-green-400">Awarded Marks: {sub.marks} / {assignment.totalMarks}</p>
                  <p className="text-gray-500 mt-1 italic">{sub.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;

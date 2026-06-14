import React, { FC, useState, useEffect } from "react";
import {
  useGetAssignmentsByCourseQuery,
  useGetStudentSubmissionQuery,
  useSubmitAssignmentMutation,
} from "@/redux/features/assignment/assignmentApi";
import toast from "react-hot-toast";
import { format } from "timeago.js";

type Props = {
  courseId: string;
};

const CourseAssignments: FC<Props> = ({ courseId }) => {
  const { data, isLoading, error } = useGetAssignmentsByCourseQuery(courseId);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);

  if (isLoading) {
    return <div className="p-5 text-center text-gray-500">Loading assignments...</div>;
  }

  if (error) {
    const err = error as any;
    if (err.status === 403) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold mb-2">Access Denied</h3>
          <p>You must be enrolled in this course to view its assignments.</p>
        </div>
      );
    }
    if (err.status === 401) {
      return <div className="p-5 text-center text-red-500">Please login to view assignments.</div>;
    }
    if (err.status === 404) {
      return <div className="p-5 text-center text-red-500">Course or assignments not found.</div>;
    }
    return <div className="p-5 text-center text-red-500">Failed to load assignments. ({err.data?.message || err.error})</div>;
  }

  const assignments = data?.assignments || [];

  if (assignments.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No assignments are available for this course yet.
      </div>
    );
  }

  if (activeAssignment) {
    return (
      <AssignmentViewer
        assignment={activeAssignment}
        onBack={() => setActiveAssignment(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment: any) => (
        <div key={assignment._id} className="p-5 border border-gray-200 dark:border-[#ffffff1d] rounded-xl bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">{assignment.title}</h3>
            <p className="text-xs text-gray-500 mt-1">Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.totalMarks} Marks</p>
          </div>
          <button
            onClick={() => setActiveAssignment(assignment)}
            className="px-6 py-2 border border-[#37a39a] text-[#37a39a] rounded-lg font-semibold hover:bg-[#37a39a]/10 transition"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

const AssignmentViewer = ({ assignment, onBack }: { assignment: any; onBack: () => void }) => {
  const { data: submissionData, refetch } = useGetStudentSubmissionQuery(assignment._id);
  const [submitAssignment, { isLoading }] = useSubmitAssignmentMutation();
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFileUrl, setSubmissionFileUrl] = useState("");

  const submission = submissionData?.submission;

  useEffect(() => {
    if (submission) {
      setSubmissionText(submission.submissionText || "");
      setSubmissionFileUrl(submission.submissionFileUrl || "");
    }
  }, [submission]);

  const handleSubmit = async () => {
    if (!submissionText && !submissionFileUrl) {
      toast.error("Please provide text or a file URL");
      return;
    }
    try {
      await submitAssignment({
        assignmentId: assignment._id,
        submissionText,
        submissionFileUrl,
      }).unwrap();
      toast.success("Assignment submitted!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit assignment");
    }
  };

  const isGraded = submission?.status === "graded";
  const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const isDisabled = isGraded || isPastDue || isLoading;

  return (
    <div className="p-5 border border-gray-200 dark:border-[#ffffff1d] rounded-xl">
      <button onClick={onBack} className="text-sm text-[#37a39a] mb-4 hover:underline">← Back to assignments</button>
      <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{assignment.title}</h2>
      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        <span className={isPastDue && !submission ? "text-red-500 font-bold" : ""}>
          Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </span>
        <span>Total Marks: {assignment.totalMarks}</span>
      </div>
      
      <div className="prose dark:prose-invert max-w-none mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <h4 className="font-semibold mb-2">Instructions</h4>
        <p className="whitespace-pre-line">{assignment.instructions}</p>
      </div>

      {isGraded ? (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
          <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Graded</h3>
          <p className="text-xl font-bold text-black dark:text-white mb-4">Marks: {submission.marks} / {assignment.totalMarks}</p>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Teacher Feedback:</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-line">{submission.feedback || "No feedback provided."}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Your Submission</h3>
          {submission && <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Submitted {format(submission.submittedAt)}</span>}
          {isPastDue && !submission && <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Submission deadline has passed.</span>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Submission</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              disabled={isDisabled}
              className={`w-full h-[150px] p-3 rounded-lg border bg-transparent text-black dark:text-white resize-none ${isDisabled ? 'border-gray-200 dark:border-slate-800 opacity-60 cursor-not-allowed' : 'border-gray-300 dark:border-slate-700'}`}
              placeholder="Write your answer here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File URL (Optional)</label>
            <input
              type="text"
              value={submissionFileUrl}
              onChange={(e) => setSubmissionFileUrl(e.target.value)}
              disabled={isDisabled}
              className={`w-full p-3 rounded-lg border bg-transparent text-black dark:text-white ${isDisabled ? 'border-gray-200 dark:border-slate-800 opacity-60 cursor-not-allowed' : 'border-gray-300 dark:border-slate-700'}`}
              placeholder="Link to Google Drive, Dropbox, Github, etc."
            />
          </div>

          <div className="pt-4 text-right">
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {isLoading ? "Submitting..." : submission ? "Update Submission" : "Submit Assignment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAssignments;

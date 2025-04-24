import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaStickyNote,
} from "react-icons/fa";
import axios from "axios";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:3000/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger-600 p-4 bg-danger-50 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">
        Job not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="page-title">Job Details</h1>
      </div>

      <div className="card space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {job.position}
            </h2>
            <p className="text-lg text-gray-600">{job.company}</p>
          </div>
          <span
            className={`status-badge ${
              job.status === "applied"
                ? "status-badge-applied"
                : job.status === "interview"
                ? "status-badge-interview"
                : "status-badge-rejected"
            }`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900">{job.location || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Applied Date</p>
              <p className="text-gray-900">
                {new Date(job.appliedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {job.url && (
          <div className="flex items-start space-x-3">
            <FaLink className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Job URL</p>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 break-all"
              >
                {job.url}
              </a>
            </div>
          </div>
        )}

        {job.notes && (
          <div className="flex items-start space-x-3">
            <FaStickyNote className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-900 whitespace-pre-wrap">{job.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            onClick={() => navigate(`/jobs/${id}/edit`)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this job application?"
                )
              ) {
                deleteMutation.mutate();
              }
            }}
            className="btn btn-danger flex items-center space-x-2"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;

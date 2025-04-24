import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

function JobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    status: "applied",
    notes: "",
    url: "",
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return axios.put(`http://localhost:3000/api/jobs/${id}`, data);
      }
      return axios.post("http://localhost:3000/api/jobs", data);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
        <h1 className="page-title">
          {isEditing ? "Edit Job Application" : "Add Job Application"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="company" className="form-label">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              className="input"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              required
              className="input"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter job position"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter job location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Job URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            className="input"
            value={formData.url}
            onChange={handleChange}
            placeholder="Enter job posting URL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            className="input"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes about the application"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => navigate("/")}
          >
            <FaTimes />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center space-x-2"
            disabled={mutation.isPending}
          >
            <FaSave />
            <span>
              {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Save"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;

import React, { useEffect, useState } from "react";
import "./template.css";
import { v1 as uuidv1 } from "uuid";
import { Add } from "@material-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DashboardHeader from "./DashboardHeader";
import api from "../../config/api";

const Template: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/forms");
        setForms(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchForms();
    }
  }, [userId]);

  const createFormHandle = () => {
    const id = uuidv1();
    navigate(`/${userId}/${id}/edit`);
  };

  const handleEditForm = (formId: string) => {
    navigate(`/${userId}/${formId}/edit`);
  };

  const handleViewResponses = (formId: string) => {
    navigate(`/${userId}/${formId}/responses`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DashboardHeader />
      <div className="template">
        <br />
        <div className="template-head">
          <div className="template-left">
            <span>Start a new form</span>
          </div>
          <div className="template-right">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>

        <div className="template-main">
          <div className="template-blank-form" onClick={createFormHandle}>
            <Add></Add>{" "}
          </div>
          <br />
          <hr />
          <hr />
          <hr />
          <hr />
          <span className={`${""} span`}>Previous Forms</span>
          <br />
          <br />

          {loading ? (
            <div>Loading your forms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : forms.length === 0 ? (
            <div>No forms found. Create your first form!</div>
          ) : (
            <div className="forms-container">
              {forms.map((form) => (
                <div key={form._id} className="form-card">
                  <h3>{form.formTitle}</h3>
                  <p>Created: {formatDate(form.createdAt)}</p>
                  <p>Last updated: {formatDate(form.updatedAt)}</p>
                  <div className="form-actions">
                    <button onClick={() => handleEditForm(form.formId)}>
                      Edit
                    </button>
                    <button onClick={() => handleViewResponses(form._id)}>
                      View Responses
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default Template;
interface Form {
  _id: string;
  formId: string;
  formTitle: string;
  createdAt: string;
  updatedAt: string;
}

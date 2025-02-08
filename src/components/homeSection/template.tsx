import React from "react";
import "./template.css";
import { v1 as uuidv1 } from "uuid";
import { Add } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const Template: React.FC = () => {
  const navigate = useNavigate();

  const createFormHandle = () => {
    const id = uuidv1();
    const userId = uuidv1();
    navigate(`/${userId}/${id}/edit`);
  };

  return (
    <div className="template">
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
      </div>
    </div>
  );
};

export default Template;

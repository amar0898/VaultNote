import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const CreateNote = () => {
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  // Note create handler
  const handleSubmit = async () => {
    if (editorContent.trim().length === 0) {
      return showErrorToast("Add some content to your note!");
    }
    try {
      setLoading(true);
      const noteData = { content: editorContent };
      await api.post("/notes", noteData);
      showSuccessToast("Your note created successfully");
      navigate("/notes");
    } catch (err) {
      showErrorToast("Error in creating your note!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] p-10">
      <div className="flex items-center gap-1 pb-5">
        <h1 className="font-montserrat text-slate-800 sm:text-4xl text-2xl font-semibold">
          Create New Note
        </h1>
        <MdNoteAlt className="text-slate-700 text-4xl" />
      </div>

      <div className="h-72 sm:mb-20 lg:mb-14 mb-28">
        <ReactQuill
          className="h-full"
          value={editorContent}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["clean"],
            ],
          }}
        />
      </div>

      <Buttons
        disabled={loading}
        onClickhandler={handleSubmit}
        className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 rounded-md transition-colors duration-300 shadow-md"
      >
        {loading ? <span>Loading...</span> : "Create Note"}
      </Buttons>
    </div>
  );
};

export default CreateNote;

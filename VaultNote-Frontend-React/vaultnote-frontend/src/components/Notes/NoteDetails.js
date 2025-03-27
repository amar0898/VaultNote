import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import { Blocks } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import Buttons from "../../utils/Buttons";
import Errors from "../Errors";
import toast from "react-hot-toast";
import Modals from "../PopModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { auditLogscolumn } from "../../utils/tableColumn";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [editorContent, setEditorContent] = useState(note?.parsedContent);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteEditLoader, setNoteEditLoader] = useState(false);
  const [editEnable, setEditEnable] = useState(false);
  const navigate = useNavigate();

  const fetchNoteDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");
      const foundNote = response.data.find((n) => n.id.toString() === id);
      if (foundNote) {
        foundNote.parsedContent = JSON.parse(foundNote.content).content;
        setNote(foundNote);
      } else {
        setError("Invalid Note");
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching note details", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAdminRole = async () => {
    try {
      const response = await api.get("/auth/user");
      const roles = response.data.roles;
      if (roles.includes("ROLE_ADMIN")) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Error checking admin role", err);
      setError("Error checking admin role", err);
    }
  };

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await api.get(`/audit/note/${id}`);
      setAuditLogs(response.data);
    } catch (err) {
      console.error("Error fetching audit logs", err);
      setError("Error fetching audit logs", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNoteDetails();
      checkAdminRole();
      if (isAdmin) {
        fetchAuditLogs();
      }
    }
  }, [id, isAdmin, fetchAuditLogs, fetchNoteDetails]);

  useEffect(() => {
    if (note?.parsedContent) {
      setEditorContent(note.parsedContent);
    }
  }, [note?.parsedContent]);

  const rows = auditLogs.map((item) => {
    const formattedDate = moment(item.timestamp).format(
      "MMMM DD, YYYY, hh:mm A"
    );

    return {
      id: item.id,
      noteId: item.noteId,
      actions: item.action,
      username: item.username,
      timestamp: formattedDate,
      noteid: item.noteId,
      note: item.noteContent,
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  const handleChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const onNoteEditHandler = async () => {
    if (editorContent.trim().length === 0) {
      return showErrorToast("Add some content to your note!");
    }

    try {
      setNoteEditLoader(true);
      const noteData = { content: editorContent };
      await api.put(`/notes/${id}`, noteData);
      showSuccessToast("Your note updated successfully");
      setEditEnable(false);
      fetchNoteDetails();
      checkAdminRole();
      if (isAdmin) {
        fetchAuditLogs();
      }
      navigate("/notes");
    } catch (err) {
      showErrorToast("Error while updating your note");
    } finally {
      setNoteEditLoader(false);
    }
  };

  const onBackHandler = () => {
    navigate(-1);
  };
  return (
    <div className=" min-h-[calc(100vh-74px)] md:px-10 md:py-8 sm:px-6 py-4 px-4">
      <Buttons
        onClickhandler={onBackHandler}
        className="bg-btnColor px-4 py-2 rounded-md text-white hover:text-slate-200 mb-3"
      >
        Go Back
      </Buttons>
      <div className=" py-6 px-8 min-h-customHeight shadow-lg shadow-gray-300 rounded-md">
        <>
          <>
            {!loading && (
              <div className="flex justify-end py-2 gap-2">
                {!editEnable ? (
                  <Buttons
                    onClickhandler={() => setEditEnable(!editEnable)}
                    className="bg-btnColor text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </Buttons>
                ) : (
                  <Buttons
                    onClickhandler={() => setEditEnable(!editEnable)}
                    className="bg-customRed text-white px-3 py-1 rounded-md"
                  >
                    Cancel
                  </Buttons>
                )}
              </div>
            )}
          </>
          {loading ? (
            <>
              <div className="flex   flex-col justify-center items-center  h-96">
                <span>
                  <Blocks
                    height="70"
                    width="70"
                    color="#4fa94d"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                  />
                </span>
                <span>Please wait...</span>
              </div>
            </>
          ) : (
            <>
              {editEnable ? (
                <>
                  <div className="h-72 sm:mb-20  lg:mb-14 mb-28 ">
                    <ReactQuill
                      className="h-full "
                      value={editorContent}
                      onChange={handleChange}
                      modules={{
                        toolbar: [
                          [
                            {
                              header: [1, 2, 3, 4, 5, 6],
                            },
                          ],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["clean"], // Moved "clean" into its own array
                        ],
                      }}
                    />

                    <Buttons
                      disabled={noteEditLoader}
                      onClickhandler={onNoteEditHandler}
                      className="bg-btnColor  md:mt-16 mt-28 text-white px-4 py-2 hover:text-slate-300 rounded-md"
                    >
                      {noteEditLoader ? (
                        <span>Loading...</span>
                      ) : (
                        " Update Note"
                      )}
                    </Buttons>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className=" text-slate-900 ql-editor"
                    dangerouslySetInnerHTML={{ __html: note?.parsedContent }}
                  ></p>
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default NoteDetails;

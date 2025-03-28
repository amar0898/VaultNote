import React, { useState } from "react";
import { MdEdit,MdDelete, MdPushPin, MdOutlinePushPin, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import Modals from "../PopModal";
import moment from "moment";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const NoteItems = ({ parsedContent, id, createdAt, pinned, favourite, onNoteUpdated, onDelete }) => {
  const formattedDate = moment(createdAt).format("D MMMM YYYY");
  const [modalOpen, setModalOpen] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(favourite);

  const togglePin = async () => {
    setPinning(true);
    try {
      const newPinned = !pinned;
      await api.put(`/notes/${id}/pin`, { pinned: newPinned });
      showSuccessToast(newPinned ? "Note pinned" : "Note unpinned");
      onNoteUpdated();
    } catch (error) {
      showErrorToast("Failed to update note pin status");
    } finally {
      setPinning(false);
    }
  };

  const toggleFavourite = async () => {
    setFavLoading(true);
    try {
      const newFavourite = !isFavourite;
      await api.put(`/notes/${id}/favourite`, { favourite: newFavourite });
      showSuccessToast(newFavourite ? "Your note added to favourites list" : "Your note removed from favourites list");
      setIsFavourite(newFavourite);
      onNoteUpdated();
    } catch (error) {
      showErrorToast("Failed to update note favourite status");
    } finally {
      setFavLoading(false);
    }
  };


  return (
    <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 text-gray-800 rounded-lg shadow-md min-h-[24rem] max-h-[24rem] overflow-hidden p-5 transition-transform transform hover:scale-105">
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
        <Tooltip title={pinned ? "Unpin Note" : "Pin Note"}>
          <IconButton onClick={togglePin} disabled={pinning}>
            {pinned ? (
              <span className="text-red-500 text-2xl" role="img" aria-label="pinned">📌</span>
            ) : (
              <MdOutlinePushPin className="text-black text-2xl" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={isFavourite ? "Remove from favourites" : "Add to favourites"}>
        <IconButton onClick={toggleFavourite} disabled={favLoading}>
            {isFavourite ? (
              <MdFavorite className="text-red-500 text-2xl" />
            ) : (
              <MdFavoriteBorder className="text-black text-2xl" />
            )}
          </IconButton>
        </Tooltip>
      </div>
      <div className="mb-12">
        <div
          className="ql-editor font-customWeight"
          dangerouslySetInnerHTML={{ __html: truncateText(parsedContent) }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-opacity-70">
      <span className="text-black text-sm">{formattedDate}</span>
      <div className="flex items-center space-x-1">
        <Tooltip title="Delete Note">
          <IconButton onClick={() => setModalOpen(true)}>
            <MdDelete className="text-black" />
          </IconButton>
        </Tooltip>
        <Link to={`/notes/${id}`}>
          <Tooltip title="Edit Note">
            <IconButton>
              <MdEdit className="text-black"/>
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
    <Modals open={modalOpen} setOpen={setModalOpen} noteId={id} onNoteDeleted={onDelete} />
    </div>
  );
};

export default NoteItems;

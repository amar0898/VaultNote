import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import moment from "moment";

const NoteItems = ({ parsedContent, id, createdAt }) => {
  const formattedDate = moment(createdAt).format("D MMMM YYYY");

  return (
    <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 text-gray-800 rounded-lg shadow-md min-h-[24rem] max-h-[24rem] overflow-hidden p-5 transition-transform transform hover:scale-105">
      {/* Note Content with bottom margin so content doesn't get hidden under footer */}
      <div className="mb-12">
        <div
          className="ql-editor font-customWeight"
          dangerouslySetInnerHTML={{ __html: truncateText(parsedContent) }}
        />
      </div>

      {/* Footer overlay fixed at the bottom */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-opacity-70">
        <span className="text-black text-sm">{formattedDate}</span>
        <Link to={`/notes/${id}`}>
          <Tooltip title="Edit Note">
            <IconButton>
              <MdRemoveRedEye className="text-black"/>
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default NoteItems;

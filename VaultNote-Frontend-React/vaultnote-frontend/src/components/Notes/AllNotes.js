import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import NoteItems from "./NoteItems";
import { FiFilePlus, FiSearch, FiAlertCircle } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors";

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  
  const [filter, setFilter] = useState({
    favouritesOnly: false,
    pinnedOnly: false,
    createdOn: "",
    updatedOn: ""
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");
      const parsedNotes = response.data.map((note) => ({
        ...note,
        parsedContent: JSON.parse(note.content).content,
      }));
      setNotes(parsedNotes);
    } catch (error) {
      setError(error.response.data.message);
      console.error("Error fetching notes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  let filteredNotes = notes.filter((note) =>
    note.parsedContent.toLowerCase().includes(query.toLowerCase())
  );

  if (filter.favouritesOnly) {
    filteredNotes = filteredNotes.filter((note) => note.favourite === true);
  }
  if (filter.pinnedOnly) {
    filteredNotes = filteredNotes.filter((note) => note.pinned === true);
  }
  if (filter.createdOn) {
    filteredNotes = filteredNotes.filter((note) =>
      note.createdAt && note.createdAt.startsWith(filter.createdOn)
    );
  }
  if (filter.updatedOn) {
    filteredNotes = filteredNotes.filter((note) =>
      note.updatedAt && note.updatedAt.startsWith(filter.updatedOn)
    );
  }

  const sortedNotes = filteredNotes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const handleNoteDeleted = () => {
    fetchNotes();
  };

  const handleFilterChange = (field, value) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] sm:py-10 sm:px-5 px-0 py-4">
      <div className="w-[92%] mx-auto">
        {!loading && notes.length > 0 && (
          <>
            <h1 className="font-montserrat text-slate-800 sm:text-4xl text-2xl font-semibold">
              My Notes
            </h1>
            <div className="mb-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-md">
    <div className="relative w-full sm:w-1/2">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search your notes..."
        className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-1">
            <label htmlFor="favouritesOnly" className="text-sm text-gray-700">
              Favourites
            </label>
            <input
              type="checkbox"
              id="favouritesOnly"
              checked={filter.favouritesOnly}
              onChange={(e) => handleFilterChange("favouritesOnly", e.target.checked)}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="pinnedOnly" className="text-sm text-gray-700">
              Pinned
            </label>
            <input
              type="checkbox"
              id="pinnedOnly"
              checked={filter.pinnedOnly}
              onChange={(e) => handleFilterChange("pinnedOnly", e.target.checked)}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="createdOn" className="text-sm text-gray-700">
              Created On
            </label>
            <input
              type="date"
              id="createdOn"
              value={filter.createdOn}
              onChange={(e) => handleFilterChange("createdOn", e.target.value)}
              className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="updatedOn" className="text-sm text-gray-700">
              Updated On
            </label>
            <input
              type="date"
              id="updatedOn"
              value={filter.updatedOn}
              onChange={(e) => handleFilterChange("updatedOn", e.target.value)}
              className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={() => {
              setFilter({
                favouritesOnly: false,
                pinnedOnly: false,
                createdOn: "",
                updatedOn: ""
              });
              setQuery("");
            }}
            className="flex items-center text-red-500 hover:text-red-600 text-bold focus:outline-none"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
          </>
        )}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
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
        ) : (
          <>
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96 p-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    You didn't create any note yet
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Start by creating a new note to keep track of your thoughts.
                  </p>
                  <div className="w-full flex justify-center">
                    <Link to="/create-note">
                      <button className="flex items-center px-4 py-2 bg-btnColor text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <FiFilePlus className="mr-2" size={24} />
                        Create New Note
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : query.trim() !== "" && sortedNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72">
                <FiAlertCircle size={48} className="text-gray-500" />
                <p className="text-gray-500 mt-4">No notes found matching your search.</p>
              </div>
            ) : (
              <div className="pt-10 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-10 gap-x-5 justify-center">
                {sortedNotes.map((item) => (
                  <NoteItems 
                    key={item.id} 
                    parsedContent={item.parsedContent} 
                    id={item.id} 
                    createdAt={item.createdAt} 
                    pinned={item.pinned} 
                    favourite={item.favourite}
                    onNoteUpdated={handleNoteDeleted} 
                    onDelete={handleNoteDeleted} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotes;

import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const socket = io("http://localhost:5000"); // Backend server URL

const Document = ({ user, fetchUser }) => {
  const navigate = useNavigate();

  const [documentContent, setDocumentContent] = useState("");
  const [documentId, setDocumentId] = useState(null); // State to store document ID

  // Debounced function to save document content to the database
  const saveContentToDatabase = useCallback(
    debounce(async (content) => {
      try {
        await axios.post(`http://localhost:5000/api/document/${documentId}`, {
          content,
        });
        console.log("Document content saved to the database");
      } catch (error) {
        console.error("Error saving document content:", error);
      }
    }, 1000), // 1 second debounce
    [documentId]
  );

  useEffect(() => {
    // Function to fetch or create a new document
    const fetchDocumentId = async () => {
      try {
        // Check if document ID exists in the URL, or create a new one
        const existingDocumentId = window.location.pathname.split("/")[2]; // Assuming ID is part of the URL
        let currentDocumentId = existingDocumentId || null;

        if (!existingDocumentId) {
          // No document ID found in the URL, create a new document
          const { data } = await axios.post(
            "http://localhost:5000/api/document/create"
          );
          currentDocumentId = data.documentId;
          window.history.pushState({}, "", `/document/${currentDocumentId}`); // Update the URL with new document ID
        }

        setDocumentId(currentDocumentId);

        // Fetch the content of the document
        const response = await axios.get(
          `http://localhost:5000/api/document/${currentDocumentId}`
        );
        setDocumentContent(response.data.content);

        // Join the document room
        socket.emit("join-document", currentDocumentId);
      } catch (error) {
        console.error("Error fetching or creating document:", error);
      }
    };

    fetchDocumentId();

    // Clean up listeners when component unmounts
    return () => {
      socket.off("receive-document");
    };
  }, []);

  useEffect(() => {
    if (!user) {
      console.log("user is not there");
      navigate("/");
    }
  }, [user]);

  // Listen for document updates from the server
  useEffect(() => {
    if (documentId) {
      socket.on("receive-document", (content) => {
        setDocumentContent(content);
      });
    }
  }, [documentId]);

  // Handle text change and emit real-time updates to the server
  const handleChange = (event) => {
    const content = event.target.value;
    setDocumentContent(content);

    // Emit real-time updates to other users
    socket.emit("edit-document", { documentId, content });

    // Debounced save to database
    saveContentToDatabase(content);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          url: currentUrl,
        });
        console.log("URL shared successfully");
      } catch (error) {
        console.log("Error sharing URL:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert("URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy URL: ", err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="card p-4 shadow-lg">
            <h1 className="text-center">Real-time Document Editor</h1>
            <div className="text-center mb-3" style={{ padding: "15px 0px" }}>
              <p className="mb-0">Share this document link with others:</p>
              <button
                onClick={handleShare}
                type="button"
                className="btn btn-dark mt-2"
              >
                Copy Url
              </button>
            </div>

            <div className="text-center mb-0">
              <h3 className="">
                Logged in as: <strong>{user ? user.name : "Guest"}</strong>
              </h3>
            </div>

            <hr />

            <h4 className="text-center mt-4">Document Content</h4>
            <textarea
              value={documentContent}
              onChange={handleChange}
              placeholder="Start writing..."
              rows={15}
              className="form-control"
              style={{ resize: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Document;

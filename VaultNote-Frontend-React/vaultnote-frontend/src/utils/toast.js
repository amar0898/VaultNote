import toast from "react-hot-toast";

export const showSuccessToast = (message = "Note created successfully") => {
  toast.success(message, {
    icon: "✅",
    style: {
      border: "1px solid #374151",       // Dark border
      background: "#1F2937",              // Tailwind Gray-800
      color: "#F9FAFB",                   // Light text for contrast
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "16px",
      whiteSpace: "normal",               // Allow text to wrap
      wordBreak: "break-word",            // Break long words if needed
      maxWidth: "400px",                  // Limit the width so that long messages wrap
    },
  });
};

export const showErrorToast = (message = "Error creating note") => {
  toast.error(message, {
    icon: "❌",
    style: {
      border: "1px solid #374151",
      background: "#1F2937",
      color: "#F9FAFB",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "16px",
      whiteSpace: "normal",
      wordBreak: "break-word",
      maxWidth: "400px",
    },
  });
};

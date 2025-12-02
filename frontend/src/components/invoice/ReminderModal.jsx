import React, { useState, useEffect, useCallback } from "react";
import { Loader, Mail, Copy, Check, X } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
  const [reminderText, setReminderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState(null);

  const generateReminder = useCallback(async () => {
    if (!invoiceId) return;

    setIsLoading(true);
    setReminderText("");
    setError(null);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_REMINDER,
        { invoiceId }
      );

      if (!response.data?.reminderText) {
        throw new Error("No reminder text received from server");
      }

      setReminderText(response.data.reminderText);
    } catch (err) {
      console.error("Error generating reminder:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate reminder. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (isOpen && invoiceId) {
      generateReminder();
    }
  }, [isOpen, invoiceId, generateReminder]);

  const handleCopyToClipboard = async () => {
    if (!reminderText) {
      toast.error("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(reminderText);
      setHasCopied(true);
      toast.success("Reminder text copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleClose = () => {
    setReminderText("");
    setError(null);
    setHasCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              AI-Generated Reminder
            </h3>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Generating reminder...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={generateReminder}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
                >
                  Try again
                </button>
              </div>
            ) : reminderText ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Reminder Email
                </label>
                <TextareaField
                  name="reminderText"
                  value={reminderText}
                  readOnly
                  rows={10}
                  className="bg-slate-50"
                />
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500">
                <p className="text-sm">No reminder generated yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              icon={hasCopied ? Check : Copy}
              disabled={isLoading || !reminderText || error}
            >
              {hasCopied ? "Copied!" : "Copy Text"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
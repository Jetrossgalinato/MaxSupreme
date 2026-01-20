"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Download } from "lucide-react";
import { deleteDocument } from "./actions";
import Alert from "@/components/custom-alert";

export interface UploadedDocument {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  file_name: string;
  file_path: string;
  file_url: string;
}

interface DocumentsTableProps {
  documents: UploadedDocument[];
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setDeletingId(id);
    const result = await deleteDocument(id, filePath);
    setDeletingId(null);

    if (result.error) {
      setAlert({ type: "error", message: "Failed to delete document" });
    } else {
      setAlert({ type: "success", message: "Document deleted successfully" });
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank"); // Fallback
    }
  };

  return (
    <div className="rounded-md border bg-card">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm text-left">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                Type
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Document Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Uploader
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Company
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Date Uploaded
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 align-middle text-center text-muted-foreground h-24"
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </td>
                  <td className="p-4 align-middle font-medium">
                    {doc.file_name}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {doc.first_name} {doc.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{doc.company || "-"}</td>
                  <td className="p-4 align-middle">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDownload(doc.file_url, doc.file_name)
                        }
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                        disabled={deletingId === doc.id}
                        title="Delete"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

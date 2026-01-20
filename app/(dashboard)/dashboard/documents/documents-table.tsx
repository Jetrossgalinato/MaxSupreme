"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Download } from "lucide-react";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-md border bg-card">
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
                        onClick={() => window.open(doc.file_url, "_blank")}
                        title="Download / View"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(doc.file_url, doc.id)}
                        title="Copy Link"
                      >
                        {copiedId === doc.id ? (
                          <span className="text-xs font-bold text-green-600">
                            Copied
                          </span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
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

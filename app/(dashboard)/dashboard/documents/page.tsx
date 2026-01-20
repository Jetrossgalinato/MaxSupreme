import { createClient } from "@/utils/supabase/server";
import { DocumentsTable } from "./documents-table";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents", error);
    // You might want to show an error state
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <TypographyH2>Documents</TypographyH2>
          <TypographyMuted>
            Manage securely uploaded client documents.
          </TypographyMuted>
        </div>
      </div>

      <DocumentsTable documents={documents || []} />
    </div>
  );
}

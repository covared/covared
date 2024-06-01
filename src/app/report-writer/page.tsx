import ProtectedRoute from "@/components/ProtectedRoute";
import ReportWriter from "@/components/ReportWriter";

export default function ReportWriterPage() {
  return (
    <ProtectedRoute>
      <ReportWriter />
    </ProtectedRoute>
  );
}

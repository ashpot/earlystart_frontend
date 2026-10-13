
import { useParams } from "react-router-dom";
import CompetitionAdminLayout from "../components/dashboard/shared/CompetitionAdminLayout";
import CompetitionForm from "../components/dashboard/shared/CompetitionForm";

export default function EditCompetitionPage() {
  const { id } = useParams();

  return (
    <CompetitionAdminLayout>
      <CompetitionForm competitionId={id} />
    </CompetitionAdminLayout>
  );
}

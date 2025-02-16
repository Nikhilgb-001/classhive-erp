
import { SchoolListCard } from "./SchoolListCard";

interface School {
  id: string;
  school_app_id: string;
  school_name: string;
  school_code: string;
  admin_name: string;
  admin_phone: string;
  status: string;
  created_at: string;
}

interface SchoolListProps {
  schools: School[] | null;
  isLoading: boolean;
}

export const SchoolList = ({ schools, isLoading }: SchoolListProps) => {
  if (isLoading) {
    return <p>Loading schools...</p>;
  }

  if (!schools || schools.length === 0) {
    return (
      <p className="text-center py-8">No schools onboarded yet.</p>
    );
  }

  return (
    <div className="grid gap-6">
      {schools.map((school) => (
        <SchoolListCard key={school.id} school={school} />
      ))}
    </div>
  );
};

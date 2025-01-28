import { AppLayout } from "@/components/layouts/AppLayout";

const AdminSchools = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Schools Management</h1>
        <p className="text-gray-500">Manage and configure schools in the platform</p>
      </div>
    </AppLayout>
  );
};

export default AdminSchools;
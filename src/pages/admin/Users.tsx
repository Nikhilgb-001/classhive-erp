import { AppLayout } from "@/components/layouts/AppLayout";

const AdminUsers = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-gray-500">Manage users and their roles across the platform</p>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
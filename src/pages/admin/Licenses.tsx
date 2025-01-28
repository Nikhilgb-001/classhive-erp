import { AppLayout } from "@/components/layouts/AppLayout";

const AdminLicenses = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">License Management</h1>
        <p className="text-gray-500">Manage school licenses and subscriptions</p>
      </div>
    </AppLayout>
  );
};

export default AdminLicenses;
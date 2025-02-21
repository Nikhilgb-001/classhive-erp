
import { AppLayout } from "@/components/layouts/AppLayout";

const Index = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-500">Your new application is ready to be built</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;

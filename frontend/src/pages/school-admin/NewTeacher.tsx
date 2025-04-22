import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PersonalInfoFields } from "@/components/teacher/PersonalInfoFields";
import { ClassSectionFields } from "@/components/teacher/ClassSectionFields";
import { SubjectFields } from "@/components/teacher/SubjectFields";
import { StatusFields } from "@/components/teacher/StatusFields";

const NewTeacher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string>("");
  const [primarySubject, setPrimarySubject] = useState<string>("");
  const [qualification, setQualification] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [isPrimaryTeacher, setIsPrimaryTeacher] = useState<string>("no");

  // Fetch class configurations
  const { data: classConfig, isLoading } = useQuery({
    queryKey: ['class-configurations'],
    queryFn: async () => {
      console.log('Fetching class configurations');
      const { data, error } = await supabase
        .from('class_configurations')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching class configurations:', error);
        throw error;
      }
      console.log('Class configurations fetched:', data);
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting teacher data");
    
    toast({
      title: "Success",
      description: "Teacher added successfully",
    });
    navigate('/school-admin/teachers');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'qualification':
        setQualification(value);
        break;
      // Add other input fields as needed
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="w-full space-y-6 bg-[#F1F1F1] min-h-screen p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent text-[#1A1F2C]"
            onClick={() => navigate('/school-admin/teachers')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">Add New Teacher</h1>
        </div>
        <div className="w-full max-w-[1400px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <PersonalInfoFields onChange={handleInputChange} />
            
            <ClassSectionFields
              classConfig={classConfig}
              selectedClass={selectedClass}
              selectedSection={selectedSection}
              onClassChange={setSelectedClass}
              onSectionChange={setSelectedSection}
            />
            
            <SubjectFields
              classConfig={classConfig}
              selectedSubjects={selectedSubjects}
              primarySubject={primarySubject}
              onSubjectsChange={setSelectedSubjects}
              onPrimarySubjectChange={setPrimarySubject}
            />
            
            <StatusFields
              qualification={qualification}
              status={status}
              isPrimaryTeacher={isPrimaryTeacher}
              onQualificationChange={handleInputChange}
              onStatusChange={setStatus}
              onIsPrimaryTeacherChange={setIsPrimaryTeacher}
            />
            
            <Button type="submit" className="w-full">Add Teacher</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewTeacher;
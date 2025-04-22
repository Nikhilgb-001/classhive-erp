import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FormSection } from "./FormSection";

export const ClassConfigurationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    classes: [""],
    sections: [""],
    subjects: [""],
  });

  const handleInputChange = (
    index: number,
    field: "classes" | "sections" | "subjects",
    value: string
  ) => {
    const newData = { ...formData };
    newData[field][index] = value;
    setFormData(newData);
  };

  const removeField = (index: number, field: "classes" | "sections" | "subjects") => {
    const newData = { ...formData };
    newData[field] = newData[field].filter((_, i) => i !== index);
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("id")
        .single();

      if (schoolError) throw schoolError;

      const classes = formData.classes.filter(c => c.trim());
      const sections = formData.sections.filter(s => s.trim());
      const subjects = formData.subjects.filter(s => s.trim());

      const { error } = await supabase
        .from("class_configurations")
        .insert({
          school_id: schoolData.id,
          classes,
          sections,
          subjects,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class configuration saved successfully",
      });
      navigate('/school-admin/classes');
    } catch (error) {
      console.error("Error saving class configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save class configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <FormSection
          title="Classes"
          items={formData.classes}
          placeholder="Enter class (e.g., 1st, 2nd)"
          onInputChange={(index, value) => handleInputChange(index, "classes", value)}
          onRemove={(index) => removeField(index, "classes")}
        />

        <FormSection
          title="Sections"
          items={formData.sections}
          placeholder="Enter section (e.g., A, B)"
          onInputChange={(index, value) => handleInputChange(index, "sections", value)}
          onRemove={(index) => removeField(index, "sections")}
        />

        <FormSection
          title="Subjects"
          items={formData.subjects}
          placeholder="Enter subject (e.g., Mathematics, Science)"
          onInputChange={(index, value) => handleInputChange(index, "subjects", value)}
          onRemove={(index) => removeField(index, "subjects")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/school-admin/classes')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </form>
  );
};
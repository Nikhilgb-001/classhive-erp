import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const addField = (field: "classes" | "sections" | "subjects") => {
    const newData = { ...formData };
    newData[field] = [...newData[field], ""];
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
        <div>
          <Label className="text-base font-semibold">Classes</Label>
          <div className="space-y-2">
            {formData.classes.map((cls, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cls}
                  onChange={(e) => handleInputChange(index, "classes", e.target.value)}
                  placeholder="Enter class (e.g., 1st, 2nd)"
                  className="flex-1"
                />
                {formData.classes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index, "classes")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Sections</Label>
          <div className="space-y-2">
            {formData.sections.map((section, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={section}
                  onChange={(e) => handleInputChange(index, "sections", e.target.value)}
                  placeholder="Enter section (e.g., A, B)"
                  className="flex-1"
                />
                {formData.sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index, "sections")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Subjects</Label>
          <div className="space-y-2">
            {formData.subjects.map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subject}
                  onChange={(e) => handleInputChange(index, "subjects", e.target.value)}
                  placeholder="Enter subject (e.g., Mathematics, Science)"
                  className="flex-1"
                />
                {formData.subjects.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index, "subjects")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
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
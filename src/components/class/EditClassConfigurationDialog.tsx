import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { FormSection } from "./FormSection";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditClassConfigurationDialogProps {
  id: string;
  initialClasses: string[];
  initialSections: string[];
  initialSubjects: string[];
  onUpdate: () => void;
}

export const EditClassConfigurationDialog = ({
  id,
  initialClasses,
  initialSections,
  initialSubjects,
  onUpdate,
}: EditClassConfigurationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    classes: [...initialClasses],
    sections: [...initialSections],
    subjects: [...initialSubjects],
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
      const { error } = await supabase
        .from("class_configurations")
        .update({
          classes: formData.classes.filter(c => c.trim()),
          sections: formData.sections.filter(s => s.trim()),
          subjects: formData.subjects.filter(s => s.trim()),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class configuration updated successfully",
      });
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Error updating class configuration:", error);
      toast({
        title: "Error",
        description: "Failed to update class configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Class Configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
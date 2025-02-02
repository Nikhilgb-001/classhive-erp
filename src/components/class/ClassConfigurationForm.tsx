import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ClassConfigurationForm = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<string[]>([""]);
  const [sections, setSections] = useState<string[]>([""]);
  const [subjects, setSubjects] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddField = (
    currentArray: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray([...currentArray, ""]);
  };

  const handleRemoveField = (
    index: number,
    currentArray: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentArray.length > 1) {
      const newArray = currentArray.filter((_, i) => i !== index);
      setArray(newArray);
    }
  };

  const handleFieldChange = (
    index: number,
    value: string,
    currentArray: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setArray(newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('id')
        .single();

      if (schoolError) throw schoolError;

      const { error } = await supabase
        .from('class_configurations')
        .insert([
          {
            school_id: schoolData.id,
            classes: classes.filter(c => c.trim() !== ""),
            sections: sections.filter(s => s.trim() !== ""),
            subjects: subjects.filter(s => s.trim() !== "")
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving class configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save class configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputArray = (
    label: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="space-y-4">
      <Label>{label}</Label>
      {array.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => handleFieldChange(index, e.target.value, array, setArray)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveField(index, array, setArray)}
            disabled={array.length === 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => handleAddField(array, setArray)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label}
      </Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      {renderInputArray("Classes", classes, setClasses)}
      {renderInputArray("Sections", sections, setSections)}
      {renderInputArray("Subjects", subjects, setSubjects)}
      
      <Button 
        type="submit" 
        className="w-full bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Configuration"}
      </Button>
    </form>
  );
};
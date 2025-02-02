import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFieldsProps {
  qualification: string;
  status: string;
  isPrimaryTeacher: string;
  onQualificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onIsPrimaryTeacherChange: (value: string) => void;
}

export const StatusFields = ({
  qualification,
  status,
  isPrimaryTeacher,
  onQualificationChange,
  onStatusChange,
  onIsPrimaryTeacherChange,
}: StatusFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            name="qualification"
            required
            placeholder="Enter qualification"
            value={qualification}
            onChange={onQualificationChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="active" className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full">Active</SelectItem>
              <SelectItem value="inactive" className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="isPrimaryTeacher">Primary Teacher</Label>
        <Select value={isPrimaryTeacher} onValueChange={onIsPrimaryTeacherChange}>
          <SelectTrigger>
            <SelectValue placeholder="Is primary teacher?" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="yes" className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full">Yes</SelectItem>
            <SelectItem value="no" className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface LogoUploadProps {
  logoUrl: string | null;
  schoolName: string;
  onLogoChange: (file: File) => void;
}

export const LogoUpload = ({ logoUrl, schoolName, onLogoChange }: LogoUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoChange(file);
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={logoUrl || ""} alt="School logo" />
        <AvatarFallback className="bg-primary/10">
          {schoolName ? schoolName[0].toUpperCase() : "S"}
        </AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="logo" className="cursor-pointer">
          <div className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
            <Upload className="h-4 w-4" />
            <span>Upload Logo</span>
          </div>
        </Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Recommended: Square image, at least 128x128px
        </p>
      </div>
    </div>
  );
};
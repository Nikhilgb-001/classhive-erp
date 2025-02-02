import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ClassConfigurationList = () => {
  const { data: configurations, isLoading } = useQuery({
    queryKey: ['class-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_configurations')
        .select(`
          *,
          schools (
            school_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading configurations...</div>;
  }

  if (!configurations?.length) {
    return <div className="text-muted-foreground">No class configurations found.</div>;
  }

  return (
    <div className="space-y-4">
      {configurations.map((config) => (
        <Card key={config.id} className="bg-white">
          <CardHeader>
            <CardTitle className="text-primary">
              {config.schools?.school_name || 'School Configuration'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-2 text-primary">Classes</h3>
                <ul className="space-y-1">
                  {config.classes.map((className, index) => (
                    <li key={index} className="text-sm text-gray-600">{className}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Sections</h3>
                <ul className="space-y-1">
                  {config.sections.map((section, index) => (
                    <li key={index} className="text-sm text-gray-600">{section}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Subjects</h3>
                <ul className="space-y-1">
                  {config.subjects.map((subject, index) => (
                    <li key={index} className="text-sm text-gray-600">{subject}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
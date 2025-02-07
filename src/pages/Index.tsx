import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const stats = [
  {
    title: "Total Students",
    value: "1,250",
    change: "+5.2%",
    icon: Users,
    trend: "up",
    description: "Active enrollments"
  },
  {
    title: "Total Teachers",
    value: "85",
    change: "+2.1%",
    icon: GraduationCap,
    trend: "up",
    description: "Faculty members"
  },
  {
    title: "Active Classes",
    value: "42",
    change: "-1.5%",
    icon: BookOpen,
    trend: "down",
    description: "Ongoing courses"
  },
  {
    title: "Average Attendance",
    value: "94%",
    change: "+3.8%",
    icon: BarChart3,
    trend: "up",
    description: "This semester"
  }
];

const recentActivities = [
  {
    type: "Enrollment",
    description: "New student enrolled in Class 10-A",
    time: "2 hours ago",
    user: "John Smith"
  },
  {
    type: "Assignment",
    description: "Mathematics homework posted for Class 8-B",
    time: "3 hours ago",
    user: "Mrs. Johnson"
  },
  {
    type: "Attendance",
    description: "Attendance marked for Class 9-C",
    time: "4 hours ago",
    user: "Mr. Davis"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast.error("Please login to continue");
        navigate('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: recentActivities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      if (!session) return [];

      const { data: schools, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent activities:', error);
        throw error;
      }

      return schools.map(school => ({
        type: "School Onboarding",
        description: `${school.school_name} was onboarded`,
        time: format(new Date(school.created_at), 'MM/dd/yyyy HH:mm'),
        user: school.admin_name
      }));
    },
    enabled: !!session,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                if (stat.title === "Total Students") {
                  navigate('/onboarding');
                }
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p className={`text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading recent activities...
                    </TableCell>
                  </TableRow>
                ) : recentActivities && recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{activity.type}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No recent activities
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
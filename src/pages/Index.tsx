import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Instaclass</h1>
          <p className="text-gray-500">Your school management dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
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
                {recentActivities.map((activity, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
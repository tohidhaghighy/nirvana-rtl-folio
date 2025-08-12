import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Code, BarChart3, Database } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "سیستم مدیریت فروش",
      category: "نرم‌افزار تجاری",
      description: "سیستم جامع مدیریت فروش با قابلیت‌های تحلیل فروش و مدیریت مشتریان",
      tech: ["React", "Node.js", "PostgreSQL"],
      icon: BarChart3,
      color: "bg-blue-500"
    },
    {
      title: "داشبورد تحلیل داده‌ها",
      category: "هوش تجاری",
      description: "داشبورد تعاملی برای نمایش و تحلیل داده‌های کسب‌وکار با چارت‌های پیشرفته",
      tech: ["Power BI", "SQL Server", "Python"],
      icon: Database,
      color: "bg-green-500"
    },
    {
      title: "اپلیکیشن موبایل خدماتی",
      category: "موبایل",
      description: "اپلیکیشن موبایل برای ارائه خدمات آنلاین با رابط کاربری مدرن",
      tech: ["React Native", "Firebase", "Redux"],
      icon: Code,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-persian">نمونه کارها</h1>
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 text-persian">
              نگاهی به برخی از پروژه‌های موفق ما
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <Card key={project.title} className="hover-lift border-0 shadow-lg animate-fade-in">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${project.color} rounded-xl mb-4 flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm text-secondary font-medium text-persian">{project.category}</span>
                    <h3 className="text-xl font-bold mb-3 text-persian">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 text-persian">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="text-persian">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      جزئیات بیشتر
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
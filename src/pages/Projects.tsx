import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Calendar,
  Code,
  BarChart3,
  Database,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "سیستم مدیریت انبار هوشمند",
      description:
        "طراحی و توسعه سیستم جامع مدیریت انبار با قابلیت‌های پیشرفته گزارش‌گیری و تحلیل",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      category: "توسعه نرم‌افزار",
      tags: ["React", "Node.js", "PostgreSQL", "Dashboard"],
      date: "۱۴۰۲/۱۲/۱۵",
      client: "شرکت توزیع کالا",
      link: "#",
    },
    {
      id: 2,
      title: "داشبورد هوش تجاری فروش",
      description:
        "ایجاد داشبورد تعاملی برای تحلیل عملکرد فروش و پیش‌بینی روندهای آینده",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      category: "هوش تجاری",
      tags: ["Power BI", "Python", "Machine Learning", "Analytics"],
      date: "۱۴۰۲/۱۱/۰۸",
      client: "فروشگاه زنجیره‌ای مهر",
      link: "#",
    },
    {
      id: 3,
      title: "اپلیکیشن موبایل بانکداری",
      description:
        "توسعه اپلیکیشن امن بانکداری موبایل با امکانات کامل تراکنش‌های بانکی",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      category: "توسعه نرم‌افزار",
      tags: ["React Native", "Blockchain", "Security", "Mobile"],
      date: "۱۴۰۲/۱۰/۲۲",
      client: "بانک دیجیتال آینده",
      link: "#",
    },
    {
      id: 4,
      title: "سیستم تحلیل داده‌های مالی",
      description:
        "پیاده‌سازی سیستم پیشرفته تحلیل داده‌های مالی با قابلیت پیش‌بینی ریسک",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
      category: "تحلیل داده",
      tags: ["Python", "TensorFlow", "Financial Analytics", "AI"],
      date: "۱۴۰۲/۰۹/۱۳",
      client: "موسسه مالی سرمایه",
      link: "#",
    },
    {
      id: 5,
      title: "پلتفرم آموزش آنلاین",
      description:
        "طراحی و ساخت پلتفرم جامع آموزش آنلاین با امکانات پیشرفته ارزیابی و گزارش‌گیری",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      category: "توسعه نرم‌افزار",
      tags: ["Vue.js", "Laravel", "MySQL", "Video Streaming"],
      date: "۱۴۰۲/۰۸/۰۵",
      client: "مؤسسه آموزشی دانش",
      link: "#",
    },
    {
      id: 6,
      title: "سیستم مدیریت هتل هوشمند",
      description:
        "ایجاد سیستم یکپارچه مدیریت هتل با اتوماسیون کامل و تحلیل رضایت مشتری",
      image:
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
      category: "هوش تجاری",
      tags: ["Angular", "ASP.NET", "IoT", "Analytics"],
      date: "۱۴۰۲/۰۷/۱۸",
      client: "هتل بین‌المللی آرامش",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <h1 className="persian-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              نمونه کارها
            </h1>
            <p className="persian-body text-xl text-muted-foreground leading-relaxed">
              نگاهی به برخی از پروژه‌های موفق ما{" "}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={project.id} className="portfolio-card group">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-foreground"
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        مشاهده
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {project.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 ml-1" />
                      {project.date}
                    </div>
                  </div>

                  <h3 className="persian-heading text-xl font-semibold text-foreground mb-3">
                    {project.title}
                  </h3>

                  <p className="persian-body text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <span className="persian-body text-sm font-medium text-foreground">
                        مشتری:{" "}
                      </span>
                      <span className="persian-body text-sm text-muted-foreground">
                        {project.client}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary text-primary-foreground">
        <div className="absolute inset-0 "></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto fade-in-up">
            <Zap className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="persian-heading text-white text-3xl md:text-5xl font-bold mb-6">
              آماده شروع پروژه بعدی هستید؟
            </h2>
            <p className="persian-body text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
              با تیم متخصص ما تماس بگیرید و پروژه‌تان را به بهترین شکل ممکن به
              واقعیت تبدیل کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent-light hover:scale-105 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  درخواست مشاوره رایگان
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;

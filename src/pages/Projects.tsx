import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, CircleCheckBig } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "میز خدمت تعزیرات حکومتی و اپلیکیشن موبایل آن",
      description:
        "طراحی و توسعه سیستم جامع میز خدمت و اپلیکیشن موبایل برای تسهیل ارائه خدمات تعزیرات حکومتی.",
      image: "./135.png",
      category: "توسعه نرم‌افزار",
      tags: ["React", "Mobile App", "Blazor", "Dashboard", "Government"],

      client: "سازمان تعزیرات حکومتی",
      link: "#",
    },
    {
      id: 2,
      title: "سامانه مدیریت پرونده‌ها",
      description:
        "پیاده‌سازی سامانه مدیریت پرونده‌ها برای بهبود روندهای کاری و افزایش بهره‌وری سازمانی.",
      image: "./cms.png",
      category: "توسعه نرم‌افزار",
      tags: ["Web App", "Microsoft SilverLight", "SQL", "Workflow"],
      client: "سازمان تعزیرات حکومتی",
      link: "#",
    },
    {
      id: 3,
      title: "مشاوره نرم‌افزاری و DevOps",
      description:
        "ارائه خدمات مشاوره در زمینه توسعه نرم‌افزار و پیاده‌سازی فرآیندهای DevOps.",
      image: "./devops.png",
      category: "مشاوره و DevOps",
      tags: ["DevOps", "CI/CD", "Cloud", "Consulting"],
      client: "شرکت‌های فناوری اطلاعات",
      link: "#",
    },
    {
      id: 4,
      title: "سامانه هوش تجاری سازمان تعزیرات",
      description:
        "ایجاد داشبورد هوش تجاری برای تحلیل داده‌های سازمان و بهبود فرآیند تصمیم‌گیری.",
      image: "./bi.jpg",
      category: "هوش تجاری",
      tags: ["Power BI", "Analytics", "Dashboard", "Data"],
      client: "سازمان تعزیرات حکومتی",
      link: "#",
    },
    {
      id: 5,
      title: "سامانه امحاء",
      description:
        "طراحی و پیاده‌سازی سامانه امحاء اسناد و مدارک با امنیت بالا و قابلیت پیگیری.",
      image: "./emha.png",
      category: "توسعه نرم‌افزار",
      tags: ["Security", "Workflow", "Web App", "Tracking"],
      client: "سازمان تعزیرات حکومتی",
      link: "#",
    },
    {
      id: 6,
      title: "سامانه مدیریت پروژه و مکاتبات",
      description:
        "پیاده‌سازی سامانه یکپارچه مدیریت پروژه‌ها و مکاتبات برای سازمان‌ها و شرکت‌ها.",
      image: "./ticketing.png",
      category: "توسعه نرم‌افزار",
      tags: ["Project Management", "Communication", "Web App", "Collaboration"],
      client: "شرکت‌ها و سازمان‌های دولتی",
      link: "#",
    },
  ];

  return (
    <>
      <SEOHead
        title="نمونه کارها - ویراپ"
        description="مشاهده پروژه‌های موفق ویراپ در زمینه توسعه نرم‌افزار، هوش تجاری و سیستم‌های مدیریت برای سازمان‌ها و شرکت‌های مختلف"
        keywords="نمونه کار، پروژه های انجام شده، میز خدمت، سامانه مدیریت، CMS، هوش تجاری، DevOps، امحاء اسناد"
        url="https://virap.ir/projects"
        image="https://virap.ir/135.png"
      />
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
                    {/* <div className="absolute bottom-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-foreground"
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        مشاهده
                      </Button>
                    </div> */}
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
                      <CircleCheckBig className="w-4 h-4 ml-1" />
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
    </>
  );
};

export default Projects;

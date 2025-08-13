
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, TrendingUp, ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "مأموریت ما",
      description: "ارائه راهکارهای نوآورانه و قابل اعتماد در حوزه فناوری اطلاعات برای رشد و بهینه‌سازی کسب‌وکارها"
    },
    {
      icon: Award,
      title: "ارزش‌های ما",
      description: "تعهد به کیفیت، نوآوری مداوم، شفافیت در ارتباطات و ایجاد ارزش پایدار برای مشتریان"
    },
    {
      icon: TrendingUp,
      title: "چشم‌انداز ما",
      description: "تبدیل شدن به پیشرو در ارائه خدمات فناوری اطلاعات در منطقه با تمرکز بر نوآوری و رضایت مشتری"
    }
  ];

  const team = [
    {
      name: "علی محمدی",
      role: "مدیرعامل و بنیانگذار",
      description: "بیش از ۱۰ سال تجربه در حوزه مدیریت پروژه‌های فناوری"
    },
    {
      name: "سارا احمدی",
      role: "مدیر فنی",
      description: "متخصص توسعه نرم‌افزار و معماری سیستم‌های پیچیده"
    },
    {
      name: "محمد رضایی",
      role: "مدیر هوش تجاری",
      description: "خبره تحلیل داده‌ها و راهکارهای هوش مصنوعی"
    },
    {
      name: "فاطمه کریمی",
      role: "مدیر طراحی تجربه کاربری",
      description: "طراح خلاق رابط‌های کاربری و تجربه کاربری"
    }
  ];

  const stats = [
    { icon: Users, value: "50+", label: "پروژه موفق" },
    { icon: Award, value: "5+", label: "سال تجربه" },
    { icon: Target, value: "30+", label: "مشتری راضی" },
    { icon: TrendingUp, value: "10+", label: "متخصص" }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background/50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 fade-in-up">
            <h1 className="persian-heading text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="text-accent block md:inline md:mr-4">
                درباره ویراپ&nbsp;
              </span>
              تیمی از متخصصان پرشور
            </h1>

            <p className="persian-body text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              ما تیمی از متخصصان پرشور هستیم که با ارائه راهکارهای نوآورانه در حوزه فناوری اطلاعات، 
              کسب‌وکارها را به سمت موفقیت هدایت می‌کنیم.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/contact">
                <Button size="lg" className="btn-hero-primary text-lg px-8 py-4">
                  شروع همکاری
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hero-secondary text-lg px-8 py-4"
                >
                  مشاهده نمونه کارها
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="persian-heading text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            ویراپ در اعداد
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fade-in-scale">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="persian-heading text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="persian-body text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="persian-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                داستان ما
              </h2>
            </div>
            <div className="text-center fade-in-up">
              <p className="persian-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                ویراپ در سال ۱۴۰۰ با هدف ارائه راهکارهای نوآورانه در حوزه فناوری اطلاعات تأسیس شد. 
                ما با درک عمیق از نیازهای کسب‌وکارهای مدرن و با بهره‌گیری از جدیدترین تکنولوژی‌ها، 
                خدماتی ارائه می‌دهیم که به رشد و بهینه‌سازی فرآیندهای کسب‌وکار کمک می‌کند.
              </p>
              <p className="persian-body text-lg md:text-xl text-muted-foreground leading-relaxed">
                در طول این سال‌ها، ما با ارائه بیش از ۵۰ پروژه موفق در زمینه‌های مختلف هوش تجاری، 
                توسعه نرم‌افزار و تحلیل داده‌ها، توانسته‌ایم اعتماد مشتریانمان را جلب کنیم و به عنوان 
                شریکی قابل اعتماد در مسیر دیجیتالی شدن کسب‌وکارها شناخته شویم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="persian-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              ارزش‌ها و اهداف ما
            </h2>
            <p className="persian-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              اصول و ارزش‌هایی که ما را در ارائه بهترین خدمات راهنمایی می‌کند
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="service-card text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="persian-heading text-2xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="persian-body text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="persian-heading text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            تیم ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={member.name}
                className="hover-lift border-0 shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-persian">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3 text-persian">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed text-persian">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in-up">
            <h2 className="persian-heading text-4xl md:text-5xl font-bold mb-6">
              آماده شروع پروژه بعدی هستید؟
            </h2>
            <p className="persian-body text-xl mb-8 text-white/90 leading-relaxed">
              با تیم متخصص ما تماس بگیرید و پروژه‌تان را به بهترین شکل ممکن به
              واقعیت تبدیل کنید
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg"
              >
                تماس با ما
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

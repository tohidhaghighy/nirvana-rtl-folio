import {
  ArrowLeft,
  ChevronDown,
  BarChart3,
  Code2,
  Database,
  Users,
  Award,
  Clock,
  Zap,
  Shield,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Home = () => {
  const stats = [
    { icon: Users, value: "۵۰+", label: "مشتری راضی" },
    { icon: Award, value: "۱۰۰+", label: "پروژه موفق" },
    { icon: Clock, value: "۳+", label: "سال تجربه" },
    { icon: Code2, value: "۲۴/۷", label: "پشتیبانی" },
  ];

  const features = [
    {
      icon: BarChart3,
      title: "هوش تجاری",
      description:
        "تبدیل داده‌های خام به بینش‌های قابل اجرا برای تصمیم‌گیری بهتر و بهینه‌سازی عملکرد",
    },
    {
      icon: Code2,
      title: "توسعه نرم‌افزار",
      description:
        "طراحی و توسعه راه‌حل‌های نرم‌افزاری مدرن، امن و قابل اعتماد با جدیدترین تکنولوژی‌ها",
    },
    {
      icon: Database,
      title: "تحلیل داده",
      description:
        "استخراج الگوها و روندهای مهم از داده‌های پیچیده شما برای رشد کسب‌وکار",
    },
  ];

  const values = [
    {
      icon: Zap,
      title: "سرعت و کیفیت",
      description: "تحویل سریع پروژه‌ها با بالاترین کیفیت و استانداردهای روز",
    },
    {
      icon: Shield,
      title: "امنیت و قابلیت اعتماد",
      description: "حفاظت کامل از داده‌ها و اطلاعات با بالاترین سطح امنیت",
    },
    {
      icon: Target,
      title: "تمرکز بر نتیجه",
      description:
        "راه‌حل‌های هدفمند که مستقیماً به اهداف کسب‌وکار شما کمک می‌کند",
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/100 to-background/50"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent"></div> */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 fade-in-up">
            <h1 className="persian-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="text-transparent bg-clip-text bg-accent block md:inline md:ml-4">
                ویراپ&nbsp;
              </span>
              راهکارهای نرم‌افزاری پیشرفته
            </h1>

            <p className="persian-body text-lg md:text-xl text-muted-dark leading-relaxed max-w-3xl mx-auto">
              شرکت پیشرو در توسعه نرم‌افزار، هوش تجاری و تحلیل داده با تیمی از
              متخصصان مجرب برای تحویل بهترین راه‌حل‌های تکنولوژیکی
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="btn-hero-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                >
                  شروع همکاری
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hero-secondary text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-accent hover:text-primary-foreground"
                >
                  مشاهده نمونه کارها
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fade-in-scale">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="persian-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="persian-body text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="persian-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              خدمات حرفه‌ای ما
            </h2>
            <p className="persian-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              با استفاده از جدیدترین تکنولوژی‌ها و روش‌های نوآورانه، راه‌حل‌های
              منحصربه‌فرد ارائه می‌دهیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="service-card text-center p-8 bg-gradient-to-br from-card to-card/50 border-card-border hover:shadow-strong"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="persian-heading text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="persian-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="persian-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              چرا ویراپ؟
            </h2>
            <p className="persian-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ارزش‌ها و اصولی که ما را در ارائه بهترین خدمات راهنمایی می‌کند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center fade-in-scale">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <value.icon className="w-10 h-10 text-accent" />
                </div>
                <h3 className="persian-heading text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="persian-body text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary text-primary-foreground">
        <div className="absolute inset-0 "></div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in-up">
            <h2 className="persian-heading text-3xl md:text-5xl font-bold mb-6">
              آماده شروع پروژه بعدی هستید؟
            </h2>
            <p className="persian-body text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
              با تیم متخصص ما تماس بگیرید و پروژه‌تان را به بهترین شکل ممکن به
              واقعیت تبدیل کنید
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent-light px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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

export default Home;

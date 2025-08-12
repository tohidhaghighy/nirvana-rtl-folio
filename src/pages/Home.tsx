import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Code, Database, Zap, Users, Target, Award } from "lucide-react";

const Home = () => {
  const services = [
    {
      icon: BarChart3,
      title: "هوش تجاری",
      description: "تحلیل داده‌های کسب‌وکار شما برای تصمیم‌گیری‌های بهتر",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Code,
      title: "توسعه نرم‌افزار",
      description: "ساخت نرم‌افزارهای مدرن و قابل اعتماد برای کسب‌وکار شما",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Database,
      title: "تحلیل داده‌ها",
      description: "کشف الگوها و بینش‌های مخفی در داده‌های شما",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "سرعت بالا",
      description: "تحویل سریع پروژه‌ها با کیفیت بالا"
    },
    {
      icon: Users,
      title: "تیم متخصص",
      description: "همکاری با بهترین متخصصان حوزه فناوری"
    },
    {
      icon: Target,
      title: "هدف‌محور",
      description: "تمرکز بر اهداف کسب‌وکار و نیازهای شما"
    },
    {
      icon: Award,
      title: "کیفیت تضمینی",
      description: "تضمین کیفیت و پشتیبانی مداوم"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-persian leading-tight">
              افزایش بهره‌وری با
              <span className="text-secondary block mt-2">ابزارهای سفارشی</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed text-persian max-w-3xl mx-auto">
              ویراپ ابزارهایی ارائه می‌دهد که بهره‌وری را افزایش و مدیریت را بهینه می‌کند.
              تحلیل داده‌ها و توسعه نرم‌افزار، دقت در تصمیم‌گیری و بهره‌وری سازمان را افزایش می‌دهد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="accent-gradient hover:scale-105 transition-transform text-lg px-8 py-3 text-persian">
                  اطلاعات بیشتر
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3 text-persian"
                >
                  مشاهده نمونه کارها
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-persian">خدمات ویراپ</h2>
            <p className="text-xl text-muted-foreground text-persian leading-relaxed">
              ویراپ با توسعه نرم‌افزارهای سازمانی، تحلیل داده‌ها و راهکارهای هوش مصنوعی، 
              ابزارهای نوآورانه‌ای برای رشد و بهینه‌سازی کسب‌وکارها ارائه می‌دهد.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.title} 
                  className="hover-lift cursor-pointer border-0 shadow-lg bg-white/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${service.bgColor} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-persian">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-persian">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-persian">چرا ویراپ؟</h2>
            <p className="text-xl text-muted-foreground text-persian">
              ویژگی‌هایی که ما را از سایرین متمایز می‌کند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-persian">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-persian">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-persian">
              آماده شروع همکاری هستید؟
            </h2>
            <p className="text-xl mb-8 text-white/90 text-persian leading-relaxed">
              با ما تماس بگیرید و اولین قدم را برای رشد کسب‌وکارتان بردارید
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="accent-gradient hover:scale-105 transition-all duration-300 text-lg px-10 py-4 text-persian shadow-lg hover:shadow-xl"
              >
                تماس با ما
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
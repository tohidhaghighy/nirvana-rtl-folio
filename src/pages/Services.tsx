import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Code, 
  Database, 
  Brain, 
  Smartphone, 
  Cloud, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const mainServices = [
    {
      id: "bi",
      icon: BarChart3,
      title: "هوش تجاری (Business Intelligence)",
      description: "تحلیل داده‌های کسب‌وکار، ایجاد داشبوردهای تحلیلی و گزارش‌گیری پیشرفته",
      features: [
        "طراحی و پیاده‌سازی داشبوردهای تحلیلی",
        "تحلیل داده‌های کسب‌وکار",
        "پیش‌بینی روندها و الگوها",
        "گزارش‌گیری خودکار",
        "تجسم داده‌ها (Data Visualization)"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "software",
      icon: Code,
      title: "توسعه نرم‌افزار",
      description: "طراحی و توسعه نرم‌افزارهای تحت وب، موبایل و دسکتاپ با استفاده از جدیدترین تکنولوژی‌ها",
      features: [
        "طراحی و توسعه وب‌سایت‌های پیشرفته",
        "ساخت اپلیکیشن‌های موبایل",
        "سیستم‌های مدیریت محتوا (CMS)",
        "سیستم‌های مدیریت ارتباط با مشتری (CRM)",
        "یکپارچه‌سازی سیستم‌ها"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "data",
      icon: Database,
      title: "تحلیل داده‌ها (Data Analysis)",
      description: "استخراج بینش‌های ارزشمند از داده‌ها، یادگیری ماشین و راهکارهای هوش مصنوعی",
      features: [
        "تحلیل آماری پیشرفته",
        "مدل‌سازی و پیش‌بینی",
        "پردازش داده‌های بزرگ (Big Data)",
        "یادگیری ماشین (Machine Learning)",
        "پردازش زبان طبیعی (NLP)"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const additionalServices = [
    {
      icon: Brain,
      title: "راهکارهای هوش مصنوعی",
      description: "پیاده‌سازی سیستم‌های هوشمند و خودکارسازی فرآیندها"
    },
    {
      icon: Smartphone,
      title: "توسعه اپلیکیشن موبایل",
      description: "ساخت اپ‌های اندروید و iOS با عملکرد بالا"
    },
    {
      icon: Cloud,
      title: "خدمات ابری",
      description: "طراحی و پیاده‌سازی زیرساخت‌های ابری"
    },
    {
      icon: Shield,
      title: "امنیت سایبری",
      description: "حفاظت از سیستم‌ها در برابر تهدیدات سایبری"
    }
  ];

  const process = [
    {
      step: "۱",
      title: "مشاوره اولیه",
      description: "درک دقیق نیازها و اهداف پروژه"
    },
    {
      step: "۲", 
      title: "طراحی راه‌حل",
      description: "ارائه بهترین راه‌حل متناسب با نیاز شما"
    },
    {
      step: "۳",
      title: "توسعه و پیاده‌سازی",
      description: "اجرای پروژه با بالاترین کیفیت"
    },
    {
      step: "۴",
      title: "آزمایش و تحویل",
      description: "آزمایش کامل و تحویل پروژه"
    },
    {
      step: "۵",
      title: "پشتیبانی مداوم",
      description: "حمایت و به‌روزرسانی مستمر"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-persian">خدمات ما</h1>
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 text-persian">
              راهکارهای جامع فناوری اطلاعات برای رشد و بهینه‌سازی کسب‌وکار شما
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  <div className={`${!isEven ? 'lg:col-start-2' : ''} animate-fade-in`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-persian">{service.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed text-persian">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3 rtl:space-x-reverse">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-foreground text-persian">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact">
                      <Button className="accent-gradient hover:scale-105 transition-transform text-persian">
                        درخواست مشاوره
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''} animate-slide-up`}>
                    <Card className="border-0 shadow-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className={`h-80 bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                          <Icon className="h-32 w-32 text-white/20" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-persian">
            سایر خدمات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.title}
                  className="hover-lift border-0 shadow-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-persian">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-persian">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-persian">
            فرآیند همکاری
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div 
                key={step.step}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-persian">{step.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed text-persian">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-scale-in">
            <Zap className="h-16 w-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-persian">
              آماده شروع پروژه خود هستید؟
            </h2>
            <p className="text-xl mb-8 text-muted-foreground text-persian leading-relaxed">
              تیم متخصص ما آماده ارائه بهترین راه‌حل برای نیازهای شماست
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="accent-gradient hover:scale-105 transition-all duration-300 text-lg px-8 py-3 text-persian"
                >
                  درخواست مشاوره رایگان
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-3 text-persian hover:bg-primary/5"
                >
                  مشاهده نمونه کارها
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
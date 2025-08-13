
import { Target, Eye, Users, Award, Lightbulb, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "نوآوری",
      description: "همیشه در جستجوی راه‌حل‌های خلاقانه و مدرن هستیم",
    },
    {
      icon: Shield,
      title: "کیفیت",
      description: "تحویل بهترین محصول با استانداردهای بالا",
    },
    {
      icon: Users,
      title: "همکاری",
      description: "کار تیمی و همکاری نزدیک با مشتریان",
    },
    {
      icon: Award,
      title: "تعهد",
      description: "پایبندی به زمان‌بندی و کیفیت پروژه‌ها",
    },
  ];

  const team = [
    {
      name: "علی محمدی",
      role: "مدیر فنی",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "سارا احمدی",
      role: "تحلیلگر ارشد",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "رضا حسینی",
      role: "توسعه‌دهنده ارشد",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <h1 className="persian-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              درباره شرکت ویراپ
            </h1>
            <p className="persian-body text-xl text-muted-foreground leading-relaxed">
              ما تیمی از متخصصان با تجربه هستیم که با شور و اشتیاق، راه‌حل‌های
              فناوری پیشرفته ارائه می‌دهیم
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <h2 className="persian-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                داستان ما
              </h2>
              <div className="space-y-6 persian-body text-muted-foreground leading-relaxed text-lg">
                <p>
                  شرکت نوین تک در سال ۱۴۰۱ با هدف ارائه خدمات مدرن فناوری
                  اطلاعات تأسیس شد. ما با تیمی از متخصصان مجرب، همیشه در تلاش
                  برای ارائه بهترین راه‌حل‌ها هستیم.
                </p>
                <p>
                  از ابتدای تأسیس تا کنون، بیش از ۳۰۰ پروژه موفق را به انجام
                  رسانده‌ایم و توانسته‌ایم اعتماد بیش از ۱۰۰ شرکت و سازمان را
                  جلب کنیم.
                </p>
                <p>
                  امروز ما به عنوان یکی از شرکت‌های پیشرو در زمینه توسعه
                  نرم‌افزار و هوش تجاری شناخته می‌شویم.
                </p>
              </div>
            </div>
            <div className="fade-in-scale">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="تیم ویراپ"
                className="rounded-2xl shadow-strong w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="persian-heading text-2xl font-bold text-foreground mb-4">
                ماموریت ما
              </h3>
              <p className="persian-body text-muted-foreground leading-relaxed">
                ارائه راه‌حل‌های فناوری نوآورانه و باکیفیت که به رشد و موفقیت
                کسب‌وکارها کمک کند و ارزش واقعی برای مشتریان ایجاد کند.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="persian-heading text-2xl font-bold text-foreground mb-4">
                چشم‌انداز ما
              </h3>
              <p className="persian-body text-muted-foreground leading-relaxed">
                تبدیل شدن به پیشرو منطقه در ارائه خدمات فناوری اطلاعات و شریک
                اصلی شرکت‌ها در مسیر تحول دیجیتال.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="persian-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              ارزش‌های ما
            </h2>
            <p className="persian-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              اصولی که در تمام فعالیت‌هایمان راهنمای ما هستند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="persian-heading text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="persian-body text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="persian-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              تیم ما
            </h2>
            <p className="persian-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              متخصصانی با تجربه که با شور و علاقه کار می‌کنند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="persian-heading text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="persian-body text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

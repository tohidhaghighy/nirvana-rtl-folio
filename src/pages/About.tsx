import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, TrendingUp } from "lucide-react";

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
    { number: "50+", label: "پروژه موفق" },
    { number: "5+", label: "سال تجربه" },
    { number: "30+", label: "مشتری راضی" },
    { number: "10+", label: "متخصص" }
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-persian">درباره ویراپ</h1>
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 text-persian">
              ما تیمی از متخصصان پرشور هستیم که با ارائه راهکارهای نوآورانه در حوزه فناوری اطلاعات، 
              کسب‌وکارها را به سمت موفقیت هدایت می‌کنیم.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-persian animate-fade-in">
              داستان ما
            </h2>
            <div className="prose prose-lg max-w-none text-center animate-slide-up">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                ویراپ در سال ۱۴۰۰ با هدف ارائه راهکارهای نوآورانه در حوزه فناوری اطلاعات تأسیس شد. 
                ما با درک عمیق از نیازهای کسب‌وکارهای مدرن و با بهره‌گیری از جدیدترین تکنولوژی‌ها، 
                خدماتی ارائه می‌دهیم که به رشد و بهینه‌سازی فرآیندهای کسب‌وکار کمک می‌کند.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground text-persian">
                در طول این سال‌ها، ما با ارائه بیش از ۵۰ پروژه موفق در زمینه‌های مختلف هوش تجاری، 
                توسعه نرم‌افزار و تحلیل داده‌ها، توانسته‌ایم اعتماد مشتریانمان را جلب کنیم و به عنوان 
                شریکی قابل اعتماد در مسیر دیجیتالی شدن کسب‌وکارها شناخته شویم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-persian">
            ارزش‌ها و اهداف ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={value.title}
                  className="hover-lift border-0 shadow-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-persian">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-persian">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-persian">
            ویراپ در اعداد
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-white/90 text-persian">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-persian">
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
    </div>
  );
};

export default About;
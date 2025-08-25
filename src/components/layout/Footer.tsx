import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  // Github,
  // Linkedin,
  // Twitter,
  Code,
  // Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-accent" />
              <span className="persian-heading text-xl font-bold text-accent">
                ویرا افزار پاسارگاد
              </span>
            </div>
            <p className="persian-body text-background/80 leading-relaxed">
              شرکت پیشرو در ارائه خدمات توسعه نرم‌افزار، هوش تجاری و تحلیل داده
              با تیمی از متخصصان مجرب
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="persian-heading text-lg font-semibold">
              لینک‌های سریع
            </h3>
            <ul className="space-y-2">
              {[
                { path: "/", label: "خانه" },
                { path: "/about", label: "درباره ما" },
                { path: "/services", label: "خدمات" },
                { path: "/projects", label: "نمونه کارها" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="persian-body text-background/80 hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="persian-heading text-lg font-semibold">خدمات ما</h3>
            <ul className="space-y-2 persian-body text-background/80">
              <li>توسعه نرم‌افزار</li>
              <li>هوش تجاری</li>
              <li>تحلیل داده</li>
              <li>مشاوره فناوری</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="persian-heading text-lg font-semibold">
              تماس با ما
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="persian-body text-background/80 ltr-content">
                  021-86096368
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="persian-body text-background/80 ltr-content">
                  info@viraap.co
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="persian-body text-background/80">
                  تهران، کارگر شمالی، خیابان نهم، پلاک ۸۲، واحد ۱
                </span>
              </div>
            </div>

            {/* Social Links */}
            {/* <div className="flex gap-4 pt-4">
              {[
                { icon: Instagram, href: "/contact" },
                { icon: Linkedin, href: "/contact" },
                { icon: Twitter, href: "/contact" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="persian-body text-background/60">
            © ۱۴۰۳ شرکت ویراپ تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

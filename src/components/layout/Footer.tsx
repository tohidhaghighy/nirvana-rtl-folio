import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "خانه", href: "/" },
    { name: "درباره ما", href: "/about" },
    { name: "خدمات", href: "/services" },
    { name: "پروژه‌ها", href: "/projects" },
  ];

  const services = [
    { name: "هوش تجاری", href: "/services#bi" },
    { name: "توسعه نرم‌افزار", href: "/services#software" },
    { name: "تحلیل داده‌ها", href: "/services#data" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">و</span>
              </div>
              <div className="text-persian">
                <h3 className="text-xl font-bold">ویراپ</h3>
                <p className="text-sm opacity-80">راهکارهای نرم‌افزاری</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed text-persian">
              ما در ویراپ با ارائه راهکارهای نوآورانه در زمینه هوش تجاری، توسعه نرم‌افزار و تحلیل داده‌ها، 
              به کسب‌وکارها کمک می‌کنیم تا در عصر دیجیتال موفق باشند.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-persian">پیوندهای سریع</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-all duration-200 text-persian"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-persian">خدمات</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-all duration-200 text-persian"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-persian">تماس با ما</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm opacity-80">
                <Mail size={16} />
                <span className="ltr">info@viraap.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm opacity-80">
                <Phone size={16} />
                <span className="ltr">+98 21 1234 5678</span>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse text-sm opacity-80">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-persian">تهران، ایران</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h5 className="text-sm font-medium mb-3 text-persian">ما را دنبال کنید</h5>
              <div className="flex space-x-3 rtl:space-x-reverse">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-200"
                      aria-label={social.name}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-70 text-persian">
              © {currentYear} ویراپ. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse text-sm opacity-70">
              <Link to="/privacy" className="hover:opacity-100 transition-opacity text-persian">
                حریم خصوصی
              </Link>
              <Link to="/terms" className="hover:opacity-100 transition-opacity text-persian">
                شرایط استفاده
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
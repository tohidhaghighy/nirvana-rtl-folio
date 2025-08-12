import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Info, Briefcase, FolderOpen, Phone, Shield } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const navigation = [
    { name: "خانه", href: "/", icon: Home },
    { name: "درباره ما", href: "/about", icon: Info },
    { name: "خدمات", href: "/services", icon: Briefcase },
    { name: "پروژه‌ها", href: "/projects", icon: FolderOpen },
    { name: "تماس", href: "/contact", icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">و</span>
            </div>
            <div className="text-persian">
              <h1 className="text-xl font-bold text-foreground">ویراپ</h1>
              <p className="text-sm text-muted-foreground">راهکارهای نرم‌افزاری</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-persian ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-persian">
                    <Shield size={16} className="ml-2" />
                    پنل مدیریت
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" size="sm" className="text-persian">
                  خروج
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="text-persian accent-gradient hover:scale-105 transition-transform">
                  ورود / ثبت نام
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-sm font-medium transition-colors rounded-lg text-persian ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {user ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors text-persian"
                    >
                      <Shield size={20} />
                      <span>پنل مدیریت</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors text-persian w-full text-right"
                    >
                      <span>خروج</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button className="w-full text-persian accent-gradient">
                      ورود / ثبت نام
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
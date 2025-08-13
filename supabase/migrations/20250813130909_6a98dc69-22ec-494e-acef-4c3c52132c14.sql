-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL UNIQUE,
  featured_image_url TEXT,
  author_id UUID NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can view all blogs" 
ON public.blogs 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Admins can create blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can update blogs" 
ON public.blogs 
FOR UPDATE 
USING (is_current_user_admin());

CREATE POLICY "Admins can delete blogs" 
ON public.blogs 
FOR DELETE 
USING (is_current_user_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blogs (title, content, excerpt, slug, author_id, published, created_at) VALUES 
(
  'آینده توسعه نرم‌افزار در ایران',
  'در این مقاله به بررسی روندهای جدید در توسعه نرم‌افزار و تأثیر آن‌ها بر صنعت فناوری اطلاعات کشور می‌پردازیم. با رشد سریع فناوری‌های جدید مثل هوش مصنوعی، اینترنت اشیا و محاسبات ابری، توسعه‌دهندگان ایرانی نیز باید خود را با این تغییرات همگام کنند.

## چالش‌های پیش رو

یکی از مهم‌ترین چالش‌های پیش روی توسعه‌دهندگان ایرانی، دسترسی به جدیدترین ابزارها و فناوری‌هاست. با وجود محدودیت‌های موجود، باید راه‌حل‌های خلاقانه‌ای برای غلبه بر این مشکلات پیدا کرد.

## فرصت‌های موجود

از طرف دیگر، بازار داخلی نیاز زیادی به نرم‌افزارهای با کیفیت دارد و این فرصت طلایی برای شرکت‌های فناوری داخلی محسوب می‌شود.',
  'بررسی روندهای جدید در توسعه نرم‌افزار و تأثیر آن‌ها بر صنعت فناوری اطلاعات کشور',
  'ayande-tosee-narmafzar-iran',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  true,
  now() - interval '2 days'
),
(
  'بهترین شیوه‌های طراحی رابط کاربری',
  'طراحی رابط کاربری یکی از مهم‌ترین جنبه‌های توسعه نرم‌افزار است که تأثیر مستقیمی بر تجربه کاربر دارد. در این مقاله، اصول اساسی طراحی UI/UX را بررسی می‌کنیم.

## اصول طراحی کاربر محور

طراحی باید همیشه با در نظر گیری نیازهای واقعی کاربران انجام شود. این یعنی:

- تحقیق درباره کاربران هدف
- ایجاد شخصیت‌های کاربری (User Personas)
- آزمایش مداوم با کاربران واقعی

## استفاده از رنگ‌ها و تایپوگرافی

انتخاب درست رنگ‌ها و فونت‌ها می‌تواند تأثیر زیادی بر خوانایی و جذابیت رابط کاربری داشته باشد. همچنین باید به مسائل دسترسی (Accessibility) نیز توجه کرد.

## طراحی واکنشگرا

در عصر حاضر، طراحی باید برای همه دستگاه‌ها و اندازه‌های مختلف صفحه بهینه باشد.',
  'اصول و روش‌های مؤثر در طراحی رابط‌های کاربری زیبا و کاربردی',
  'behtarin-shivehaye-tarahi-ui',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  true,
  now() - interval '5 days'
),
(
  'معماری میکروسرویس‌ها: راهنمای کامل',
  'میکروسرویس‌ها رویکردی مدرن برای توسعه نرم‌افزار هستند که امکان مقیاس‌پذیری و نگهداری بهتر سیستم‌های بزرگ را فراهم می‌کنند.

## مزایای میکروسرویس‌ها

- مقیاس‌پذیری مستقل سرویس‌ها
- امکان استفاده از تکنولوژی‌های مختلف
- تست و استقرار آسان‌تر
- تیم‌های کوچک‌تر و تخصصی‌تر

## چالش‌های پیاده‌سازی

- پیچیدگی شبکه و ارتباطات
- مدیریت داده‌ها و تراکنش‌ها
- نظارت و لاگ‌گیری

## ابزارهای مورد نیاز

برای پیاده‌سازی موفق میکروسرویس‌ها، باید از ابزارهای مناسبی مثل Docker، Kubernetes و API Gateway استفاده کرد.',
  'آشنایی با مزایا، چالش‌ها و بهترین شیوه‌های پیاده‌سازی معماری میکروسرویس',
  'memari-microservices-rahnama',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  true,
  now() - interval '1 week'
);
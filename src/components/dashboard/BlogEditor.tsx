import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/hooks/useAuthStore";
import { toast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  featured_image_url?: string;
}

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export const BlogEditor = ({ post, onClose }: BlogEditorProps) => {
  const { user } = useAuthStore();
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    published: false,
    featured_image_url: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        published: post.published,
        featured_image_url: post.featured_image_url || "",
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    const persianToEnglish: { [key: string]: string } = {
      ا: "a",
      ب: "b",
      پ: "p",
      ت: "t",
      ث: "s",
      ج: "j",
      چ: "ch",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "z",
      ر: "r",
      ز: "z",
      ژ: "zh",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "d",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ک: "k",
      گ: "g",
      ل: "l",
      م: "m",
      ن: "n",
      و: "v",
      ه: "h",
      ی: "y",
      " ": "-",
      "‌": "-",
    };

    return title
      .split("")
      .map((char) => persianToEnglish[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-|\-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!user) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        variant: "destructive",
        title: "خطا",
        description: "عنوان و محتوای مقاله الزامی است",
      });
      return;
    }

    setSaving(true);

    try {
      const postData = {
        ...formData,
        published: publish,
        author_id: user.id,
      };

      let error;

      if (post) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("blogs")
          .update(postData)
          .eq("id", post.id);
        error = updateError;
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from("blogs")
          .insert(postData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "موفق",
        description: post
          ? publish
            ? "مقاله ذخیره و منتشر شد"
            : "مقاله ذخیره شد"
          : publish
          ? "مقاله ایجاد و منتشر شد"
          : "مقاله ایجاد شد",
      });

      onClose(true);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "خطا در ذخیره مقاله",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClose()}
            className="persian-body"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground persian-heading">
              {post ? "ویرایش مقاله" : "مقاله جدید"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={loading}
            className="persian-body"
          >
            <Save className="w-4 h-4 ml-2" />
            ذخیره پیش‌نویس
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="persian-body"
          >
            <Eye className="w-4 h-4 ml-2" />
            ذخیره و انتشار
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="persian-heading">محتوای مقاله</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="persian-body">
                  عنوان
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="عنوان مقاله را وارد کنید"
                  className="persian-body"
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="persian-body">
                  خلاصه
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="خلاصه‌ای کوتاه از مقاله"
                  className="persian-body"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content" className="persian-body">
                  محتوا
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="محتوای مقاله را وارد کنید"
                  className="persian-body min-h-[400px]"
                />
                <p className="text-sm text-muted-foreground mt-1 persian-body">
                  برای ایجاد عنوان از ## استفاده کنید
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="persian-heading">تنظیمات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug" className="persian-body">
                  آدرس مقاله
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="blog-post-url"
                  className="persian-body text-left"
                  dir="ltr"
                />
                <p className="text-sm text-muted-foreground mt-1 persian-body">
                  آدرس مقاله در وبسایت
                </p>
              </div>

              <div>
                <Label htmlFor="featured_image" className="persian-body">
                  تصویر شاخص
                </Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_image_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="persian-body text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  dir="rtl"
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(published) =>
                    setFormData((prev) => ({ ...prev, published }))
                  }
                />
                <Label htmlFor="published" className="persian-body">
                  انتشار مقاله
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

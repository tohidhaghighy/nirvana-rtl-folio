import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  created_at: string;
  updated_at: string;
  featured_image_url?: string;
  author_id: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "مقاله یافت نشد",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "لینک کپی شد",
        description: "لینک مقاله در کلیپ‌بورد کپی شد",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">بارگذاری مقاله...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 persian-heading">
            مقاله یافت نشد
          </h1>
          <p className="text-muted-foreground mb-8 persian-body">
            متأسفانه مقاله مورد نظر شما یافت نشد.
          </p>
          <Link to="/blog">
            <Button variant="outline" className="persian-body">
              <ArrowRight className="w-4 h-4 ml-2" />
              بازگشت به مقالات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="persian-body">
              <ArrowRight className="w-4 h-4 ml-2" />
              بازگشت به مقالات
            </Button>
          </Link>
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="persian-body">
                مقاله فنی
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 persian-heading">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-6 text-muted-foreground persian-body">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>نویسنده</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="persian-body"
              >
                <Share2 className="w-4 h-4 ml-2" />
                اشتراک‌گذاری
              </Button>
            </div>

            {post.excerpt && (
              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <p className="text-lg text-foreground/90 persian-body leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none persian-body text-justify">
            <div
              className="leading-relaxed text-foreground/90"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.8",
              }}
            >
              {post.content.split("\n").map((line, index) => {
                // Check for block-level elements first (headings, lists)
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-foreground mt-12 mb-6 persian-heading"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                } else if (line.startsWith("# ")) {
                  return (
                    <h1
                      key={index}
                      className="text-3xl font-bold text-foreground mt-12 mb-6 persian-heading"
                    >
                      {line.replace("# ", "")}
                    </h1>
                  );
                } else if (line.startsWith("- ")) {
                  return (
                    <li key={index} className="mb-2 mr-6 list-disc">
                      {line.replace("- ", "")}
                    </li>
                  );
                } else if (line.trim() === "") {
                  return <br key={index} />;
                } else {
                  // If it's a regular paragraph, process inline bolding
                  const parts = line.split("**");
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {parts.map((part, i) => {
                        if (i % 2 === 1) {
                          return <strong key={i}>{part}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
              })}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground persian-body">
                آخرین بروزرسانی: {formatDate(post.updated_at)}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="persian-body"
              >
                <Share2 className="w-4 h-4 ml-2" />
                اشتراک‌گذاری
              </Button>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

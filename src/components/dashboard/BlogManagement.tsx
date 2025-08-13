import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  FileText 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BlogEditor } from "./BlogEditor";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  featured_image_url?: string;
}

export const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "خطا در بارگذاری مقالات",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, published: !p.published }
          : p
      ));

      toast({
        title: "موفق",
        description: post.published ? "مقاله از حالت انتشار خارج شد" : "مقاله منتشر شد",
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "خطا در تغییر وضعیت انتشار",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== postId));
      toast({
        title: "موفق",
        description: "مقاله با موفقیت حذف شد",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "خطا در حذف مقاله",
      });
    }
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleEditorClose = (shouldRefresh?: boolean) => {
    setShowEditor(false);
    setEditingPost(null);
    if (shouldRefresh) {
      fetchPosts();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showEditor) {
    return (
      <BlogEditor 
        post={editingPost}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground persian-heading">
            مدیریت مقالات
          </h2>
          <p className="text-muted-foreground persian-body">
            ایجاد و مدیریت مقالات وبسایت
          </p>
        </div>
        <Button onClick={handleCreateNew} className="persian-body">
          <Plus className="w-4 h-4 ml-2" />
          مقاله جدید
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">بارگذاری مقالات...</div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2 persian-heading">
              هیچ مقاله‌ای موجود نیست
            </h3>
            <p className="text-muted-foreground mb-4 persian-body">
              اولین مقاله خود را ایجاد کنید
            </p>
            <Button onClick={handleCreateNew} className="persian-body">
              <Plus className="w-4 h-4 ml-2" />
              ایجاد مقاله
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl persian-heading">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground persian-body">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <Badge 
                        variant={post.published ? "default" : "secondary"}
                        className="persian-body"
                      >
                        {post.published ? "منتشر شده" : "پیش‌نویس"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(post)}
                      className="persian-body"
                    >
                      {post.published ? (
                        <>
                          <EyeOff className="w-4 h-4 ml-1" />
                          عدم انتشار
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 ml-1" />
                          انتشار
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="persian-body"
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      ویرایش
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive persian-body"
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {post.excerpt && (
                <CardContent>
                  <p className="text-muted-foreground persian-body line-clamp-2">
                    {post.excerpt}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
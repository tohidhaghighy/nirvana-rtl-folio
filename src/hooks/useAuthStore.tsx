import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: () => {
    if (get().initialized) return;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        set({ 
          session, 
          user: session?.user ?? null,
          loading: false 
        });

        if (event === 'SIGNED_IN') {
          toast({
            title: "خوش آمدید",
            description: "با موفقیت وارد شدید.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "خروج",
            description: "با موفقیت خارج شدید.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ 
        session, 
        user: session?.user ?? null,
        loading: false,
        initialized: true
      });
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      let errorMessage = "خطا در ورود به سیستم";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "ایمیل یا رمز عبور اشتباه است";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "لطفاً ایمیل خود را تأیید کنید";
      }
      
      toast({
        variant: "destructive",
        title: "خطا",
        description: errorMessage,
      });
    }

    return { error };
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true });
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      set({ loading: false });
      let errorMessage = "خطا در ثبت نام";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "کاربری با این ایمیل قبلاً ثبت نام کرده است";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "فرمت ایمیل صحیح نیست";
      }
      
      toast({
        variant: "destructive",
        title: "خطا",
        description: errorMessage,
      });
    } else {
      set({ loading: false });
      toast({
        title: "ثبت نام موفق",
        description: "لطفاً ایمیل خود را بررسی کنید و لینک تأیید را کلیک کنید.",
      });
    }

    return { error };
  },

  signOut: async () => {
    set({ loading: true });
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "خطا در خروج از سیستم",
      });
    }
    
    set({ loading: false });
  },
}));
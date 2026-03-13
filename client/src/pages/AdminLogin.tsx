import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Giriş başarılı!");
      setLocation("/admin/panel");
    },
    onError: (error) => {
      toast.error(error.message || "Giriş başarısız");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Lütfen şifre giriniz");
      return;
    }
    loginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FFD300] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#2F2F2F]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2F2F2F]">
            Admin Paneli
          </CardTitle>
          <CardDescription className="text-[#2F2F2F]/60">
            Yönetim paneline erişmek için şifrenizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2F2F2F]">
                Şifre
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin şifresini giriniz"
                  className="pr-10 h-12 text-lg border-[#2F2F2F]/20 focus:border-[#FFD300] focus:ring-[#FFD300]"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F2F2F]/50 hover:text-[#2F2F2F]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 text-lg font-semibold bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2F2F2F]/10 text-center">
            <a
              href="/"
              className="text-sm text-[#2F2F2F]/60 hover:text-[#FFD300] transition-colors"
            >
              ← Ana sayfaya dön
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

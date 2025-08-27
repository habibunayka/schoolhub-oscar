import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register as registerService, login as loginService } from "@lib/api/services/authentications";
import {
  Button,
  Input,
  Label,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/common/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await registerService({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      const loginRes = await loginService({
        email: formData.email,
        password: formData.password,
      });
      return loginRes;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword &&
      formData.grade &&
      acceptTerms
    ) {
      mutation.mutate();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          {/* School Logo */}
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">SH</span>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-foreground">
            Join SchoolHub
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Create your account to start exploring activities
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="pl-10 bg-input-background border-border focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your school email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-input-background border-border focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
              </div>
            </div>

            {/* Grade Selection */}
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 z-10" />
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleInputChange("grade", value)}
                >
                  <SelectTrigger className="pl-10 bg-input-background border-border focus:border-[#2563EB] focus:ring-[#2563EB]">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade-7">Grade 7</SelectItem>
                    <SelectItem value="grade-8">Grade 8</SelectItem>
                    <SelectItem value="grade-9">Grade 9</SelectItem>
                    <SelectItem value="grade-10">Grade 10</SelectItem>
                    <SelectItem value="grade-11">Grade 11</SelectItem>
                    <SelectItem value="grade-12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10 bg-input-background border-border focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="pl-10 pr-10 bg-input-background border-border focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formData.password !== formData.confirmPassword &&
                formData.confirmPassword && (
                  <p className="text-xs text-[#DC2626]">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="text-sm cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#2563EB] hover:text-blue-700 p-0 h-auto underline"
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#2563EB] hover:text-blue-700 p-0 h-auto underline"
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>

            {/* Create Account Button */}
            {mutation.error && (
              <p className="text-sm text-red-600">
                {mutation.error.userMessage || mutation.error.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={
                !acceptTerms ||
                formData.password !== formData.confirmPassword ||
                mutation.isLoading
              }
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-3 text-base font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? "Creating..." : "Create Account"}
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
                className="text-[#2563EB] hover:text-blue-700 p-0 h-auto font-medium"
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

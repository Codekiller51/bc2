"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    password: "",
    userType: "client",
    acceptedTerms: false
  })

  const handleUserTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, userType: type }));
  }

  // Create validation schema
  const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    location: z.string().min(2, "Location is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  });
  
  // Add profession field for creative users
  const creativeSchema = userSchema.extend({
    profession: z.string().min(2, "Profession is required"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setIsLoading(true);

    try {
      // Validate form data
      const schema = formData.userType === 'creative' ? creativeSchema : userSchema;
      const validatedData = schema.parse(formData);

      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.name,
            phone: validatedData.phone,
            location: validatedData.location,
            user_type: formData.userType,
            role: formData.userType, // Add role to metadata
            category: formData.userType === 'creative' ? 'General' : undefined,
            ...(formData.userType === 'creative' && { profession: validatedData.profession })
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          throw new Error(`This email is already registered.`);
        } else {
          throw new Error(signUpError.message);
        }
      }

      // For creative users, ensure profile is created properly
      if (formData.userType === 'creative') {
        // Wait a moment for the trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if profile was created and create manually if needed
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if creative profile was created by trigger
          const { data: existingProfile } = await supabase
            .from('creative_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          // If no profile exists, create it manually
          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from('creative_profiles')
              .insert({
                user_id: user.id,
                title: validatedData.profession,
                category: 'General', // Default category
                bio: `Professional ${validatedData.profession} based in ${validatedData.location}`,
                approval_status: 'pending',
                rating: 0,
                reviews_count: 0,
                completed_projects: 0,
                hourly_rate: 50000, // Default rate in TZS
                availability_status: 'available'
              });
            
            if (profileError) {
              console.error('Failed to create creative profile:', profileError);
              // Don't throw error here as user is already created
            }
          }
        }
      }
      if (formData.userType === 'creative') {
        toast.success("Account created successfully! Your profile will be reviewed by our admin team before becoming visible to clients.");
        
        setTimeout(() => {
          navigate("/profile/complete");
        }, 2000);
      } else {
        toast.success("Account created successfully! Please check your email to verify your account.");
        
        setTimeout(() => {
          navigate("/profile/complete");
        }, 2000);
      }
      
    } catch (error: any) {
      // Handle zod validation errors
      if (error.errors) {
        const firstError = error.errors[0];
        setError(firstError.message);
        toast.error(firstError.message);
      } else {
        // Handle other errors
        const errorMessage = error.message || "Failed to create account";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 mobile-padding">
      <Card className="card-brand mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-h2 text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join Brand Connect to find or offer creative services across Tanzania
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="client" 
                onClick={() => handleUserTypeChange("client")}
              >
                Client
              </TabsTrigger>
              <TabsTrigger 
                value="creative" 
                onClick={() => handleUserTypeChange("creative")}
              >
                Creative Professional
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="client-name" className="form-label">Full Name</Label>
                <Input
                  id="client-name" 
                  placeholder="Enter your full name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email" className="form-label">Email</Label>
                <Input
                  id="client-email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone" className="form-label">Phone Number</Label>
                <Input
                  id="client-phone" 
                  placeholder="Enter your phone number"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-location" className="form-label">Location</Label>
                <Input
                  id="client-location" 
                  placeholder="Enter your city/region"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="client-password" className="form-label">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="client-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-input"
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    required
                  />
                  <label htmlFor="terms" className="text-body-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-brand-600 hover:text-brand-700 hover:underline transition-colors">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-brand-600 hover:text-brand-700 hover:underline transition-colors">Privacy Policy</Link>
                  </label>
                </div>
                <p className="text-caption text-muted-foreground">
                  By registering, you agree to receive marketing communications and updates as outlined in our Privacy Policy.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="creative" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="creative-name" className="form-label">Full Name</Label>
                <Input
                  id="creative-name" 
                  placeholder="Enter your full name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creative-email" className="form-label">Email</Label>
                <Input
                  id="creative-email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creative-phone" className="form-label">Phone Number</Label>
                <Input
                  id="creative-phone" 
                  placeholder="Enter your phone number"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creative-location" className="form-label">Location</Label>
                <Input
                  id="creative-location" 
                  placeholder="Enter your city/region"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creative-profession" className="form-label">Profession</Label>
                <Input
                  id="creative-profession" 
                  placeholder="e.g. Graphic Designer, Photographer"
                  className="form-input"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="creative-password" className="form-label">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="creative-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms-creative"
                    className="h-4 w-4 rounded border-input"
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    required
                  />
                  <label htmlFor="terms-creative" className="text-body-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-brand-600 hover:text-brand-700 hover:underline transition-colors">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-brand-600 hover:text-brand-700 hover:underline transition-colors">Privacy Policy</Link>
                  </label>
                </div>
                <p className="text-caption text-muted-foreground">
                  By registering, you agree to receive marketing communications and updates as outlined in our Privacy Policy.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="mt-4 text-center text-body-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}
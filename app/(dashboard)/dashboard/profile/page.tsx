import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { AvatarUpload } from "./avatar-upload";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { email, user_metadata } = user;
  const fullName = user_metadata?.full_name || "";
  const firstName = user_metadata?.first_name || "";
  const lastName = user_metadata?.last_name || "";
  const avatarUrl = user_metadata?.avatar_url || "";
  const role = user_metadata?.role || "Member";

  const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <TypographyH2>Profile</TypographyH2>
          <TypographyMuted>
            View and manage your profile information.
          </TypographyMuted>
        </div>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
               <AvatarUpload
                  userId={user.id}
                  avatarUrl={avatarUrl}
                  fallback={
                    fullName
                      ? getInitials(fullName)
                      : firstName
                      ? getInitials(firstName + " " + lastName)
                      : email?.slice(0, 2).toUpperCase() || "??"
                  }
                  className="h-24 w-24"
                />
              <div className="mt-4 sm:mt-0 text-center sm:text-left">
                 <h3 className="text-lg font-medium">{fullName || `${firstName} ${lastName}`}</h3>
                 <p className="text-sm text-muted-foreground">{email}</p>
                 <div className="mt-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                      {role}
                    </span>
                 </div>
              </div>
            </div>

            <ProfileForm 
              firstName={firstName} 
              lastName={lastName} 
              email={email || ""} 
            />
          </CardContent>
        </Card>

        <PasswordForm />
      </div>
    </div>
  );
}

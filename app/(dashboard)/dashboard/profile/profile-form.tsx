"use client";

import { useActionState, useState, useEffect } from "react";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Alert from "@/components/custom-alert";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

const initialState = {
  success: false,
  error: undefined,
  message: undefined,
};

export function ProfileForm({ firstName, lastName, email }: ProfileFormProps) {
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateProfile, initialState);
  const [alertState, setAlertState] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
      // Use a timeout to avoid synchronous state updates during rendering
      const timer = setTimeout(() => {
        if (state.error) {
          setAlertState({ type: "error", message: state.error });
        } else if (state.success && state.message) {
          setAlertState({ type: "success", message: state.message });
        }
      }, 0);
      return () => clearTimeout(timer);
    }, [state]);

  return (
    <form action={action} className="space-y-8">
      {alertState && (
        <Alert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState(null)}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={firstName}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={lastName}
            required
            placeholder="Enter your last name"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            required
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

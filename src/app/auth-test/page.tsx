"use client";

import { AuthTestPanel } from "~/app/components/auth/AuthTestPanel";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function AuthTestPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Flow Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use this page to test the authentication flow and debug any issues.
            </p>
            <div className="flex gap-2">
              <Link href="/login">
                <Button>Test Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Test Signup</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Test Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <AuthTestPanel />
      </div>
    </div>
  );
} 
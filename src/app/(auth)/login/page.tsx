import { AuthCard, LoginForm } from '@/presentation/components/auth';

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to sign in"
    >
      <LoginForm />
    </AuthCard>
  );
}

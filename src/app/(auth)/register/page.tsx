import { AuthCard, RegisterForm } from '@/presentation/components/auth';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Enter your details to get started"
    >
      <RegisterForm />
    </AuthCard>
  );
}

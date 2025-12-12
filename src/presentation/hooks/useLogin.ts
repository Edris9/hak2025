import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { LoginCredentials, AuthResponse, ApiErrorResponse } from '@/application/dto';
import { authRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthContext();

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authRepository.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    },
  });
}

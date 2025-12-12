import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { RegisterData, AuthResponse, ApiErrorResponse } from '@/application/dto';
import { authRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useRegister() {
  const router = useRouter();
  const { setAuth } = useAuthContext();

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, RegisterData>({
    mutationFn: (data: RegisterData) => authRepository.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    },
  });
}

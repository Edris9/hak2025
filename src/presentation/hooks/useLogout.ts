import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthContext();

  return useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });
}

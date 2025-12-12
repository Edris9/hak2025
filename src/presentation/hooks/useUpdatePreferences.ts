import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UpdatePreferencesData, ApiErrorResponse } from '@/application/dto';
import { User } from '@/domain/models';
import { userRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useUpdatePreferences() {
  const { updateUser } = useAuthContext();

  return useMutation<User, AxiosError<ApiErrorResponse>, UpdatePreferencesData>({
    mutationFn: (data: UpdatePreferencesData) => userRepository.updatePreferences(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
}

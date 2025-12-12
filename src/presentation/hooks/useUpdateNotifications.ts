import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UpdateNotificationsData, ApiErrorResponse } from '@/application/dto';
import { User } from '@/domain/models';
import { userRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useUpdateNotifications() {
  const { updateUser } = useAuthContext();

  return useMutation<User, AxiosError<ApiErrorResponse>, UpdateNotificationsData>({
    mutationFn: (data: UpdateNotificationsData) => userRepository.updateNotifications(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
}

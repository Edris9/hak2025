import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UpdateProfileData, ApiErrorResponse } from '@/application/dto';
import { User } from '@/domain/models';
import { userRepository } from '@/infrastructure/repositories';
import { useAuthContext } from '@/presentation/providers';

export function useUpdateProfile() {
  const { updateUser } = useAuthContext();

  return useMutation<User, AxiosError<ApiErrorResponse>, UpdateProfileData>({
    mutationFn: (data: UpdateProfileData) => userRepository.updateProfile(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
}

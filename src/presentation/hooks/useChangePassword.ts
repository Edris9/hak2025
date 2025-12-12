import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChangePasswordData, ApiErrorResponse } from '@/application/dto';
import { userRepository } from '@/infrastructure/repositories';

export function useChangePassword() {
  return useMutation<void, AxiosError<ApiErrorResponse>, ChangePasswordData>({
    mutationFn: (data: ChangePasswordData) => userRepository.changePassword(data),
  });
}

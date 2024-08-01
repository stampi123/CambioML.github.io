import axios, { AxiosError, AxiosResponse } from 'axios';

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_VERIFICATION_EMAIL_URL}/resend-verification-email`;

interface IParams {
  userId: string;
}

export const resendVerificationEmail = ({ userId }: IParams): Promise<AxiosResponse | AxiosError> => {
  return axios
    .post(
      API_ENDPOINT,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error: AxiosError) => {
      console.error('Failed to resend verification email:', error);
      throw error;
    })
    .finally(() => {
      console.log('Resend verification email request completed.');
    });
};

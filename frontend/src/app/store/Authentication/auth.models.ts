import { UserMeResponse } from '../../../client/models';

export interface AuthState {
  user: UserMeResponse | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

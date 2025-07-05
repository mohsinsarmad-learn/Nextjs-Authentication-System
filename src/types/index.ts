export interface ClientUser {
  _id: string;
  UserId: string;
  firstname: string;
  lastname: string;
  email: string;
  isVerified: boolean;
  contact?: string;
  profilepic?: string | File;
  newPassword?: string;
}

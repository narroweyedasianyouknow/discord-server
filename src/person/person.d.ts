import { Without } from '@/explored_things';

export type PersonType = {
  password?: string; //	the user's password
  username: string; //	the user's username, not unique across the platform	identify
  avatar?: string; //	the user's avatar hash	identify
  bot?: boolean; //	whether the user belongs to an OAuth2 application	identify
  system?: boolean; //	whether the user is an Official Discord System user (part of the urgent message system)	identify
  mfa_enabled?: boolean; //	whether the user has two factor enabled on their account	identify
  banner?: string; //	the user's banner hash	identify
  accent_color?: string; //	the user's banner color encoded as an integer representation of hexadecimal color code	identify
  locale?: string; //	the user's chosen language option	identify
  verified?: boolean; //	whether the email on this account has been verified	email
  email?: string; //	the user's email	email
};

export type UserType = Without<PersonType, 'password'>;

export interface IResponseOautServer {
  error_description: string;
  error: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

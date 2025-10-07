export interface Credential {
  id: string;
  name: string;
  email: string;
  issuedAt?: string;
  workerId?: string;
}

export interface IssueResponse {
  message: string;
  credential?: Credential;
}

export interface VerifyResponse {
  valid: boolean;
  workerId?: string;
  timestamp?: string;
  message?: string;
}

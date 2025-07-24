import { jwtDecode } from "jwt-decode";
 
export interface DecodedPayload {
  UserID: number;
  UserTypeID: number;
  UserTypeName: string;
  Username: string;
  BoundaryName: string;
  BoundaryLevelID: number;
  UserFullName: string;
  BoundaryID: number;
  isLoggedIn: number;
  tokenUUID: string;
  iat?: number;
  exp?: number;
}

export function decodeJwtToken(token: string): DecodedPayload | null {
  try {
    return jwtDecode<DecodedPayload>(token);
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
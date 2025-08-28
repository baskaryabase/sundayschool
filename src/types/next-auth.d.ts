import { UserRole } from '../models/User';
import 'next-auth';
import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: UserRole;
      /** The user's ID. */
      id?: string;
    } & DefaultSession['user'];
  }

  interface User {
    /** The user's role. */
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    role?: UserRole;
    /** The user's ID. */
    id?: string;
  }
}

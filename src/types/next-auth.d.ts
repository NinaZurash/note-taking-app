import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    emailVerified: Date | null;
    id: number;
    username: string;
  }
  interface Session {
    user: User & {
      email: string;
    };
    token: {
      email: string;
    };
  }
}

// declare module "next-auth" {
//   interface User {
//     username: string | null;
//     fullName: string | null;
//   }
//   interface Session {
//     user: User & {
//       username: string;
//       fullName: string | null;
//     };
//     token: {
//       username: string;
//       fullName: string | null;
//     };
//   }
// }

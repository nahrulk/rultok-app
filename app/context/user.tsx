"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account, ID } from "@/libs/AppWriteClient";
import { useRouter } from "next/navigation";
import { User, UserContextTypes } from "../types";
import useGetProfileByUserId from "../hooks/useGetProfileByUserId";
import useCreateProfile from "../hooks/useCreateProfile";

const UserContext = createContext<UserContextTypes | null>(null);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  //   Fungsi Check User

  const checkUser = async () => {
    try {
      const currentSession = await account.getSession("current");

      if (!currentSession) return;

      const promise = (await account.get()) as any;
      const profile = await useGetProfileByUserId(promise?.$id);

      const userData = {
        id: promise?.$id,
        name: promise?.name,
        bio: profile?.bio,
        image: profile?.image,
      };

      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  //   Fungsi Register
  const register = async (name: string, email: string, password: string) => {
    try {
      const promise = await account.create(ID.unique(), email, password, name);

      await account.createEmailSession(email, password);

      await useCreateProfile(
        promise?.$id,
        name,
        String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEAFULT_IMAGE_ID),
        ""
      );

      await checkUser();
    } catch (error) {
      throw error;
    }
  };

  //   Fungsi Login

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password);
      await checkUser();
    } catch (error) {
      throw error;
    }
  };

  // Fungsi Logout

  const logout = async () => {
    try {
      account.deleteSession("current");
      setUser(null);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <UserContext.Provider
        value={{ user, login, register, logout, checkUser }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);

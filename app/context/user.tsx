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
import { UserContextTypes } from "../types";

const UserContext = createContext<UserContextTypes | null>(null);

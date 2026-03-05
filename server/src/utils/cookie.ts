import type { Response, CookieOptions } from "express";
import { env } from "../config/env";

export const getCookieOptions = (isRefresh = false): CookieOptions => {
    return {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: isRefresh
            ? 7 * 24 * 60 * 60 * 1000 // 7 days
            : 15 * 60 * 1000,         // 15 mins
    };
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, getCookieOptions(false));
    res.cookie("refreshToken", refreshToken, getCookieOptions(true));
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", getCookieOptions(false));
    res.clearCookie("refreshToken", getCookieOptions(true));
};

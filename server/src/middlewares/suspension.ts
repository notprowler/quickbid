import express, { Request, Response, NextFunction } from "express";
import supabase from "@/config/database";

/* User can still be authenticated but suspended due to rating therefore remove user access */
const SuspensionPolicy: (req: Request, res: Response, next: NextFunction) => void | Promise<void> = async (req, res, next) => {
    const userID = req.user?.user_id;

    if (!userID) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }

    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", userID)
            .single();

        if (error) { throw error }

        if (!data || typeof data.suspension_count !== "number") {
            res.status(404).json({ error: "Invalid user or suspension count not found" });
            return;
        }

        /* if user account gets banned remove access token, before access to endpoints again with ProtectedRoute */
        if (!data) {
            res.clearCookie("access-token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
            res.status(403).json({ error: "Account is banned, forcing the user out of the system" });
            return;
        }

        /* If user account gets suspended then still in the app but cannot do anything */
        if (data.status == "suspended") {
            res.status(401).json({ error: `Account of ${data.username} is suspended, please pay a $50 fine or appeal for suspension lift in the profile page!` });
            return;
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
            return;
        } else if (typeof e == "object" && e !== null && "message" in e) {
            res.status(500).json({ error: `${e.message}` });
            return;
        }
    }

    next();
}

export default SuspensionPolicy;
import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const getUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}, returning empty data for user`, data: {} });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error, returning empty data for user', data: {} });
        }
    }
}

const updateUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    const newInfo = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update(newInfo)
            .eq('user_id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error updating user information' });
        }
    }
};

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error deleting user' });
        }
    }
};

/* Only soft delete option we have for TS */
const updateUserStatus: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ status })
            .eq('user_id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error updating user status' });
        }
    }
};

export { getUser, updateUser, deleteUser, updateUserStatus };
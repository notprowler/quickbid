import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const getUser: RequestHandler = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user_id)
    .single();

if (error) {
    res.status(404).json({ error: error.message });
}

res.status(200).json(data);
}

const updateUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const newInfo = req.body;
    const { data, error } = await supabase
        .from('users')
        .update(newInfo)
        .eq('id', id)
        .select()
        
    if (error) {
        res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
};

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', id);

    if (error) {
        res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
};

export { getUser, updateUser, deleteUser };
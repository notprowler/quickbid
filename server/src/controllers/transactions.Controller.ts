import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";


const newTransaction: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {itemID, transaction_amount, discount_applied } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    try {
        const { data, error } = await supabase.
        from('transactions')
        .insert([{
              buyer_id: parseInt(id,10),
              item_id: itemID,
              transaction_amount: transaction_amount,
              discount_applied: discount_applied
            }])
        .select();
        
        if (error) throw error;
        res.status(200).json(data);
    } catch(e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        }
    }
};

const getTransactions: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Please provide a User ID' });
        return;
    }

    try {
        const { data, error } = await supabase
        .from('transactions')
        .select(`*, listings("*")`)
        .order('created_at', { ascending: false })
        .eq('buyer_id', id);

        if (error) throw error;
        
        res.status(200).json(data);
     } catch(e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        }
    }
}

export default {newTransaction, getTransactions}
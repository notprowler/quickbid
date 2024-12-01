import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";


const newTransaction: RequestHandler = async (req: Request, res: Response) => {
    const { buyerID, sellerID, itemID, transaction_amount, discount_applied } = req.body;

    try {
        const { data, error } = await supabase.
        from('transactions')
        .insert([{
              buyer_id: buyerID,
              seller_id: sellerID,
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

export default {newTransaction}
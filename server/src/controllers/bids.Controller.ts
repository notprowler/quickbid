import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const newBid: RequestHandler = async (req: Request, res: Response) => {
    const { itemID } = req.params;
    const { bidderID, bidValue, bidDeadline } = req.body;

    if (!itemID) {
        res.status(400).json({ error: 'Item ID is required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('bids')
            .insert([{ item_id: parseInt(itemID, 10), bidder_id: bidderID, bid_amount: bidValue, bid_deadline: bidDeadline, bid_status: 'pending' }])
            .eq('item_id', itemID)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error posting new bid' });
        }
    }
}

const retrieveAllBids: RequestHandler = async (req: Request, res: Response) => {
    const { itemID } = req.params;

    if (!itemID) {
        res.status(400).json({ error: 'Item ID is required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('bids')
            .select('*')
            .eq('item_id', itemID)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error retrieving all bids' });
        }
    }
}

/* Helper to reject all other bids once a bid is accepted */
const rejectAllBids: (itemID: string, bidID: number) => Promise<void> = async (itemID: string, bidID: number) => {
    const { data, error } = await supabase
        .from('bids')
        .update({ bid_status: 'rejected' })
        .eq('item_id', itemID)
        .neq('bid_id', bidID);

    if (error) {
        throw new Error(`${error.message}`);
    }
};

const bidAccepted: RequestHandler = async (req: Request, res: Response) => {
    const {itemID} = req.params;
    const {bidderID, bidValue} = req.body;

    if (!itemID) {
        res.status(400).json({ error: 'Item ID is required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('bids')
            .update({ bid_status: 'accepted' })
            .eq('item_id', itemID)
            .eq('bidder_id', bidderID)
            .eq('bid_amount', bidValue)
            .select();
        
        if (error) throw error;

        if (!data || !data[0]) {
            res.status(500).json({error: 'Error updating row'});
            return;
        } 

        rejectAllBids(itemID, data[0].bid_id)
        res.status(200).json(data);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error accepting bid' });
        }
    }
}

const bidRejected: RequestHandler = async (req: Request, res: Response) => {
    const { itemID } = req.params;
    const {bidderID, bidValue} = req.body;

    if (!itemID) {
        res.status(400).json({ error: 'Item ID is required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('bids')
            .update({ bid_status: 'rejected' })
            .eq('item_id', itemID)
            .eq('bidder_id', bidderID)
            .eq('bid_amount', bidValue)
            .select();
        
        if (error) throw error;
        res.status(200).json(data);
    } catch(e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        } else {
            res.status(500).json({ error: 'Unknown error rejecting bid' });
        }
    }
}


export default { newBid, retrieveAllBids, bidAccepted, bidRejected }
import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

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
        }
    }
}

//1. if bid rejected then user money goes back to his wallet.
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
        }
    }
}

// PRE: check if user has enough money he put for bid.
// PRE: Check if new bidder is same as old bidder and Give back the old Bidders money back to his account
// if a user places another bid conserqutively. only deduct the difference from old bid from wallet.
// 1. deduct money from users account. 
// 2. Update the New Highest bidder and bid amount
// 3. Update the listings table with the new bid - Need to do this because productpage is using that info. 
// 4. If the deadline is hit then the listings becomes deactivated and owners gets to decide wether to sell or not

const placeBid: RequestHandler = async (req: Request, res: Response) => {
    const { itemID } = req.params;
    const { bidValue } = req.body;

    // TODO come back and change this value
    const bidderID = req.user?.user_id || 104;
   
    if (!itemID || !bidderID || !bidValue) {
        res.status(400).json({ error: 'Item ID, Bidder ID, Bid Value, and Bid Deadline are required' });
        return;
    }

    try {
// ------------------------------------------------------------------------------------------------
        //PRE:
        // Check if the user has sufficient funds for bid he put
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('balance')
            .eq('user_id', bidderID)
            .single();

        if (userError) throw userError;

        if (userData.balance < bidValue) {
            res.status(400).json({ error: 'Insufficient funds' });
            return;
        }
// ------------------------------------------------------------------------------------------------
    //PRE:
    // Give back users money to his account.
    const { data: previousBidData, error: previousBidError } = await supabase
        .from('bids')
        .select('bidder_id, bid_amount')
        .eq('item_id', itemID)
        .eq('bid_status', 'pending')
        .single();

    if (previousBidError) throw previousBidError;

    if (previousBidData && previousBidData.bidder_id) {
        const { bidder_id: oldBidder, bid_amount: oldAmount } = previousBidData;

        if (oldBidder !== bidderID) {
            const { data: refundData, error: refundError } = await supabase
                .from('users')
                .select('balance')
                .eq('user_id', oldBidder)
                .single();

            if (refundError) throw refundError;

            const newBalance = refundData.balance + oldAmount;

            const { error: updateError } = await supabase
                .from('users')
                .update({ balance: newBalance })
                .eq('user_id', oldBidder);

            if (updateError) throw updateError;
        }
    }
// ------------------------------------------------------------------------------------------------
        //1. Deduct money from users wallet
        const { error: walletError } = await supabase
            .from('users')
            .update({ balance: userData.balance - bidValue })
            .eq('user_id', bidderID);

        if (walletError) throw walletError;
// ------------------------------------------------------------------------------------------------

        //2. update bidding table for new highest bidder and bid amount. 
        const { data: bidData, error: bidError } = await supabase
            .from('bids')
            .update({ bid_amount: bidValue, bid_status: 'pending', bidder_id: bidderID })
            .eq('item_id', itemID)
            .select();

        if (bidError) throw bidError;

        res.status(200).json(bidData);

// ------------------------------------------------------------------------------------------------

        //3. Update the listings table with the new price 
        const { data: update, error: error } = await supabase
        .from('listings')
        .update({ price: bidValue})
        .eq('item_id', itemID)
        .select();

// ------------------------------------------------------------------------------------------------

    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: `${e.message}` });
        } else if (typeof e === 'object' && e !== null && 'message' in e) {
            res.status(500).json({ error: `${e.message}` });
        }
    }
}

export default { retrieveAllBids, bidAccepted, bidRejected, placeBid }
import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const newBid: RequestHandler = async (req: Request, res: Response)  => {
    const {productID} = req.params;
    const {userID, bidValue} = req.body;

}

const retrieveAllBids: RequestHandler = async (req: Request, res: Response) => {
    const{productID} = req.params;
}

const bidAccepted: RequestHandler = async (req: Request, res: Response) => {
    const {productID} = req.params;

}

const bidRejected: RequestHandler = async (req: Request, res: Response) => {
    const {productID} = req.params;

}


export default {newBid, retrieveAllBids, bidAccepted, bidRejected}
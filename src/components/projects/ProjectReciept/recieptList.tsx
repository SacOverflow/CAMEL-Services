'use client'

import React, { useState, useEffect, useRef } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import { IReceipts } from '@/types/database.interface';

const getAllReciptsForProject=async (project_id:string)=>{
const supaBase=await createSupbaseClient();
project_id= project_id ? project_id:project_id='a7188d51-4ea8-492e-9277-7989551a3b97'
const {data:reciepts, error}= await supaBase
    .from('receipts')
    .select('*')
    .eq('proj_id', project_id).order('created_at', { ascending: false });;
    
    error?console.error('faild to get reciepts',error): ()=>{}
    return reciepts
}


const RecieptList = ({proj_id}:{proj_id:string}) => {
  const [receipts, setReceipts] = useState<IReceipts[]|any>([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await getAllReciptsForProject(proj_id);
        setReceipts(res);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceipts();
  }, []);


  return (
    <div className="container mx-auto p-4">
      {receipts.length > 0 ? (
        <div className="flex overflow-x-auto scroll-snap-x">
          {receipts.map((receipt:IReceipts) => (
            <div key={receipt.id} className="scroll-snap-align-center min-w-full">
              <ReceiptCard receipt={receipt} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No receipts found.</div>
      )}
    </div>
  );


};



    const ReceiptCard = ({ receipt }: { receipt: IReceipts }) => {
     
 
      return (
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col items-center mx-1">
          {receipt.image && (
            <img src={receipt.image} alt={`Receipt from ${receipt.store}`} className="w-full h-32 rounded-t-lg object-cover" />
          )}
          <div className="w-full flex flex-col items-center mt-4">
            <div className="text-lg font-bold">{receipt.store}</div>
            <div className="text-lg font-bold">${receipt.price_total.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mb-2">{receipt.category}</div>
            {receipt.category && (
              <div className="text-sm text-gray-500 w-full text-center border-t pt-2">
                Notes: {receipt.note}
              </div>
            )}
          </div>
        </div>
      );
    };
    
export default RecieptList;

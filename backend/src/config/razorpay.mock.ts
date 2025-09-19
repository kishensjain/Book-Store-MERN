export const razorpay = {
    orders:{
        async create(options:any){
            //Simulate order creation
            return {
                id: "order_mock" + Date.now(),
                amount: options.amount,
                currency: options.currency,
                receipt:options.receipt,
                notes : options.notes,
                status: "created",
            };
        }
    }
}
export class BalanceHelper {
    private walletAddress:string;
    public balance: number = 0;

    constructor(walletAddress:string){
        this.walletAddress = walletAddress; 
        this.callMetaverseAPI(this.walletAddress);
    }

    callMetaverseAPI = async(walletAddress: string) => {
        let BalanceAmount: number;
		try {
			const res = await fetch(
				`https://devnet-gateway.multiversx.com/address/${walletAddress}/esdt/PSF-36ce19`
			);

			const data = await res.json();

            return data.data.tokenData.balance; 

		} catch (err) {
			console.log(err);
		}  
	};

}
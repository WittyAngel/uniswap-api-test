import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import routerAbi from '../abi/router.json';
import { uni_router, uni_address, weth_address } from "../utils/contract";

const path = [weth_address, uni_address];
const useSwap = () => {

    const swapFunc = async (address: string, value: string) => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        var eth_balance = await web3.eth.getBalance(address); //Will give value in.
        eth_balance = web3.utils.fromWei(eth_balance.toString());
        
        const blockInfo = await web3.eth.getBlock('latest');
        var deadline = blockInfo.timestamp;
        deadline = deadline + '600';
        console.log(deadline, '--------', address, value);
        const routerContract = new web3.eth.Contract((routerAbi as unknown) as AbiItem, uni_router);
        const tx = await routerContract.methods.swapExactETHForTokens(0, path, address, deadline).send({from: address, value: web3.utils.toWei(value, 'ether')});
        await tx.wait();
        return ;
    }
    const getAmountOut = async (value: string) => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const routerContract = new web3.eth.Contract((routerAbi as unknown) as AbiItem, uni_router);
        //function getAmountsOut(uint amountIn, address[] memory path)
        const tx = await routerContract.methods.getAmountsOut(web3.utils.toWei(value, 'ether'), path).call();
        console.log(web3.utils.fromWei(tx[1]));
        return Number(web3.utils.fromWei(tx[1])).toFixed(4);
    }

    return { swapFunc, getAmountOut};
}

export default useSwap;
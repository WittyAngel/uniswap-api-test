import { useWeb3React } from "@web3-react/core";
import { Button, Col, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { MdArrowDownward } from 'react-icons/md';
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useWallet from "../hooks/useWallet";
import useSwap from "../hooks/useSwap";
import { requestChangeNetwork } from "../utils/connector";

const Swap = () => {

    const { Title } = Typography;

    const { account, active } = useWeb3React();
    const { login, logout } = useAuth();
    const { getBalance } = useWallet();
    const {swapFunc, getAmountOut} = useSwap();
 
    const [ethVal, setEthVal] = useState('');
    const [uniVal, setUniVal] = useState('');
    const [ethBalance, setEthBalance] = useState('');
    const [uniBalance, setUniBalance] = useState('');
    const [uniAmount, setUniAmount] = useState('0.0');
    useEffect(() => {
        if (window.ethereum === undefined) {
            toast.warning("Please install Metamask wallet");
        } else {
            if (window.ethereum.networkVersion !== 1 || window.ethereum.networkVersion !== 3) {
                requestChangeNetwork('0x3');
            }
        }
    }, []);

    useEffect(() => {
        const getEthBalance = async (account: string) => {
            try {
                const balanceOf = await getBalance(account);
                setEthBalance(balanceOf.eth);
                setUniBalance(balanceOf.uni);
            } catch (err) {
                console.log(err);
            }
        }
        if (account !== undefined) {
            console.log(account)
            getEthBalance(String(account));
        }
    }, [account])

    const onChangeInput = (e: any) => {
        setEthVal(e)

        const getUniAmountOut = async (e:any) => {
            try {
                var amountOut = await getAmountOut(e);
                setUniAmount(amountOut);
            } catch (err) {
                console.log(err);
            }
        }
        getUniAmountOut(e);

    }

    return (
        <Row style={{ paddingTop: '10%' }}>
            <Col span={8}></Col>
            <Col span={8} className="swap-box p-4">
                <Title level={2}>Swap</Title>
                <div className="bordered p-3 position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                        <Button
                            type="primary"
                            shape="round"
                            className="d-flex align-items-center py-1"
                            style={{ minHeight: '40px' }}
                        >
                            <img src="assets/images/ethereum.png" alt="" width="30px" />&nbsp;ETH
                        </Button>
                        <Input
                            min={0}
                            placeholder="0.00"
                            onChange={(e) => onChangeInput(e.target.value)}
                            style={{ textAlign: 'right', fontSize: '20px' }}
                            pattern="[0-9]*[.,]?[0-9]"
                            className="border-0 input-text"
                        />
                    </div>
                    <Typography className="mt-2">Balance: {Number(ethBalance)} ETH</Typography>
                    <div className="arrow d-flex justify-content-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <MdArrowDownward />
                        </div>
                    </div>
                </div>
                <div className="bordered p-3 mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <Button
                            type="primary"
                            shape="round"
                            className="d-flex align-items-center"
                            style={{ minHeight: '40px' }}
                        >
                            <img src="assets/images/download.png" alt="" width="30px" />&nbsp;UNI
                        </Button>
                        <Input
                            min={0}
                            placeholder="0.00"
                            value = {uniAmount}
                            onChange={onChangeInput}
                            style={{ textAlign: 'right', fontSize: '20px' }}
                            pattern="^[\.0-9]*$"
                            className="border-0 input-text"
                            disabled
                        />
                    </div>
                    <Typography className="mt-2">Balance: {Number(uniBalance)} UNI</Typography>
                </div>
                {
                    active ? (
                        <Button
                            type="primary"
                            shape="round"
                            className="mt-2"
                            style={{ minHeight: '50px' }}
                            block
                            onClick={() => swapFunc(String(account), ethVal)}
                        >
                            {account}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            shape="round"
                            className="mt-2"
                            style={{ minHeight: '50px' }}
                            block
                            onClick={() => login()}
                        >
                            Connect Wallet
                        </Button>
                    )
                }
            </Col>
            <Col span={8}></Col>
        </Row>
    )
}

export default Swap;
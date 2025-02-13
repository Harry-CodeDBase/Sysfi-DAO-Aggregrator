import stakingABI from "../abi/SysFiyieldfarming.json";
import tokenABI from "../abi/SysfiABI.json";
import DAOFactoryAbi from "../abi/DAOFactory.json";
import DaoAbi from "../abi/SYNDAO.json";
import TokenLaunchAbi from "../abi/LaunchToken.json";
import CrowdSaleAbi from "../abi/Crowdsale.json";
import CrowdSaleFactoryAbi from "../abi/CrowdsaleFactory.json";

export const tokenContractConfig = {
  address: "0x57aA274417f48Ada26817A303b11F9dfc8aC5c7B",
  abi: tokenABI,
};

export const stakingContractConfig = {
  address: "0x898e3eE1E80786D87B370DcB12627fC8a30790Dd",
  abi: stakingABI,
};

export const daoFactoryConfig = {
  address: "0x38d92c2216AA3cF50623CdA5852122D3aa3c3071",
  abi: DAOFactoryAbi,
};

export const synDAOConfig = {
  address: "0x3d5fEF5ba907f8F4734F2e54f877A783933021A4",
  abi: DaoAbi,
};

export const launchTokenConfig = {
  address: "0xa9Bbe48EA3EA3390b19b44FBBD320c539eEfF438",
  abi: TokenLaunchAbi,
};

export const CrowdsaleConfig = {
  address: "0x172C3b967877Ad8634A2b42B9a89808161844196",
  abi: CrowdSaleAbi,
};

export const CreateCrowdsaleConfig = {
  address: "0xB147FaBC3e00977768aEF3cD0C8cADe21Bb1cD74",
  abi: CrowdSaleFactoryAbi,
};

export const erc20Abi = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

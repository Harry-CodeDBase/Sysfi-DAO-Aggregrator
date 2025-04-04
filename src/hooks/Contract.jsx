import stakingABI from "../abi/SysFiyieldfarming.json";
import tokenABI from "../abi/SysfiABI.json";
import WrappedABI from "../abi/Wsyn.json";
import DAOFactoryAbi from "../abi/DAOFactory.json";
import DaoAbi from "../abi/SYNDAO.json";
import TokenLaunchAbi from "../abi/LaunchToken.json";
import CrowdSaleAbi from "../abi/Crowdsale.json";
import CrowdSaleFactoryAbi from "../abi/CrowdsaleFactory.json";
import NFT from "../abi/NFT.json";

// 0xecc0e95d7953d5f6e53057c102f86ba8eb7597d8 0xB2F6777A302791B2aDe8963fd45AD10170dBe6CE

// export const tokenContractConfig = {
//   address: "0x898a51D63b8dDF5b528eB10B6d526237CEfBdB6E",
//   abi: WrappedABI,
// };
// export const wrappedContractConfig = {
//   address: "0x898a51D63b8dDF5b528eB10B6d526237CEfBdB6E",
//   abi: WrappedABI,
// };

// export const stakingContractConfig = {
//   address: "0x0B035be08d50e8f772f40B603Afd0Eb903d5221E",
//   abi: stakingABI,
// };

// export const daoFactoryConfig = {
//   address: "0x4DF4836Decd8221Ef16F3EfD382CA802fd33a47B",
//   abi: DAOFactoryAbi,
// };

// export const synDAOConfig = {
//   address: "0x30b931F22ABe5568798F8211d6cD943932F7dCdb",
//   abi: DaoAbi,
// };

// export const launchTokenConfig = {
//   address: "0x0853792b693df2c6D019b1Fd800f5E5Eb2b67B13",
//   abi: TokenLaunchAbi,
// };

// export const CrowdsaleConfig = {
//   address: "0x172C3b967877Ad8634A2b42B9a89808161844196",
//   abi: CrowdSaleAbi,
// };

// export const CreateCrowdsaleConfig = {
//   address: "0x0E6582Bee0aeB71f3F6326b83A0a71B4bB6c23f1",
//   abi: CrowdSaleFactoryAbi,
// };

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

export const tokenContractConfig = {
  address: "0x57aA274417f48Ada26817A303b11F9dfc8aC5c7B",
  abi: WrappedABI,
};
export const wrappedContractConfig = {
  address: "0x57aA274417f48Ada26817A303b11F9dfc8aC5c7B",
  abi: WrappedABI,
};

export const stakingContractConfig = {
  address: "0x898e3eE1E80786D87B370DcB12627fC8a30790Dd",
  abi: stakingABI,
};

export const daoFactoryConfig = {
  address: "0x6809e8F3e4C56B23E8fbD34b54b609ad8215F985",
  abi: DAOFactoryAbi,
};

export const synDAOConfig = {
  address: "0x5D19688703a5B0A244987C887ab38aF869aA65b5",
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
  address: "0xEcc0e95D7953D5F6E53057c102F86ba8eB7597D8",
  abi: CrowdSaleFactoryAbi,
};

export const Alphas = {
  address: "0xb228846b22769A9CC8D542C208Fd3522cc605486",
  abi: NFT,
};

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useContractWrite } from "wagmi";
import { daoFactoryConfig, erc20Abi } from "./Contract"; // Ensure these are correctly defined

export function useDAOFactory() {
  const { address, isConnected } = useAccount();
  const [creating, setCreating] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Read contract data
  const { data: nativeFee, isSuccess: isNativeFeeSuccess } = useReadContract({
    address: daoFactoryConfig.address,
    abi: daoFactoryConfig.abi,
    functionName: "nativeDaoCreationFee",
  });

  const { data: tokenFee, isSuccess: isTokenFeeSuccess } = useReadContract({
    address: daoFactoryConfig.address,
    abi: daoFactoryConfig.abi,
    functionName: "tokenDaoCreationFee",
  });

  const { data: feeTokenAddress, isSuccess: isFeeTokenAddressSuccess } =
    useReadContract({
      address: daoFactoryConfig.address,
      abi: daoFactoryConfig.abi,
      functionName: "feeToken",
    });

  const { data: deployedDAOs, isSuccess: isDeployedDAOsSuccess } =
    useReadContract({
      address: daoFactoryConfig.address,
      abi: daoFactoryConfig.abi,
      functionName: "getDeployedDAOs",
    });

  // When all data is loaded, mark the hook as ready
  useEffect(() => {
    setIsDataReady(
      isNativeFeeSuccess &&
        isTokenFeeSuccess &&
        isFeeTokenAddressSuccess &&
        isDeployedDAOsSuccess
    );
  }, [
    isNativeFeeSuccess,
    isTokenFeeSuccess,
    isFeeTokenAddressSuccess,
    isDeployedDAOsSuccess,
  ]);

  // Approve contract write hook
  const {
    writeContractAsync: approveWrite,
    data: approveTxData,
    isLoading: approveIsLoading,
    isSuccess: approveIsSuccess,
    error: approveError,
  } = useContractWrite();

  // Create DAO contract write hook
  const {
    writeContractAsync: createDAOWrite,
    data: createTxData,
    isLoading: createIsLoading,
    isSuccess: createIsSuccess,
    error: createError,
  } = useContractWrite();

  /**
   * Approve the DAOFactory contract to spend fee tokens.
   */
  const approveFee = async ({ amount }) => {
    if (!isDataReady) throw new Error("Data is not ready yet.");
    if (!feeTokenAddress)
      throw new Error("Fee token address is not available.");

    return await approveWrite({
      address: feeTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [daoFactoryConfig.address, amount],
    });
  };

  /**
   * Create a DAO.
   */
  const createDAO = async ({
    quorum,
    votingPeriodHours,
    tokenAddress,
    genre,
    daoName,
  }) => {
    if (!isDataReady) throw new Error("Data is not ready yet.");
    setCreating(true);

    try {
      const overrides = {};
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        if (!nativeFee) throw new Error("Native fee not loaded yet.");
        overrides.value = nativeFee;
      } else if (!tokenFee) {
        throw new Error("Token DAO fee not loaded yet.");
      }

      return await createDAOWrite({
        address: daoFactoryConfig.address,
        abi: daoFactoryConfig.abi,
        functionName: "createDAO",
        args: [quorum, votingPeriodHours, tokenAddress, genre, daoName],
        overrides,
      });
    } catch (err) {
      console.error("Error creating DAO:", err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return {
    isConnected,
    nativeFee,
    tokenFee,
    feeTokenAddress,
    deployedDAOs,
    createDAO,
    creating,
    createTxData,
    createError,
    createIsLoading,
    createIsSuccess,
    approveFee,
    approveTxData,
    approveError,
    approveIsLoading,
    approveIsSuccess,
    isDataReady,
  };
}

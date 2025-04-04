import { useAccount, useContractReads, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState } from "react";
import { CrowdsaleConfig } from "./Contract"; // Contains your Crowdsale ABI
import { erc20Abi } from "./Contract"; // Ensure you import your token's ABI
import { waitForTransactionReceipt } from "viem/actions";

export default function useCrowdsaleContract(contractAddress) {
  const { address: userAddress } = useAccount();
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useContractWrite();

  // Batch read the crowdsale details
  const {
    data: detailsData,
    isLoading: detailsLoading,
    error: detailsError,
  } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "token",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "creator",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "startTime",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "endTime",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "tokensForSale",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "rate",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "softCap",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "hardCap",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "totalETHRaised",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "finalized",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "successful",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "initialized",
      },
      {
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "viewPotentialReturn",
        args:[userAddress],
      },
    ],
  });

  console.log(userAddress)
  // Map the returned array into a human-readable object.

  const details = detailsData
    ? {
        token: detailsData[0].result,
        creator: detailsData[1].result,
        startTime: new Date(
          Number(detailsData[2].result) * 1000
        ).toLocaleString(),
        endTime: new Date(
          Number(detailsData[3].result) * 1000
        ).toLocaleString(),
        rawStartTime: detailsData[2].result,
        rawEndTime: detailsData[3].result,
        tokensForSale: formatEther(detailsData[4].result),
        rate: formatEther(detailsData[5].result),
        stake: detailsData[12]?.result
          ? formatEther(detailsData[12].result)
          : "0",
        softCap: formatEther(detailsData[6].result),
        hardCap: formatEther(detailsData[7].result),
        totalETHRaised: formatEther(detailsData[8].result),
        finalized: detailsData[9].result,
        successful: detailsData[10].result,
        initialized: detailsData[11].result,
      }
    : null;

  const approve = async () => {
    if (!details) {
      console.error("Crowdsale details not loaded yet.");
      return;
    }
    if (userAddress?.toLowerCase() !== details.creator?.toLowerCase()) {
      console.error("Only the creator can approve.");
      return;
    }

    setLoading(true);
    try {
      const grossTokens = parseEther(details.tokensForSale);
      console.log("Approving contract to spend:", grossTokens.toString());

      const approveTxHash = await writeContractAsync({
        address: details.token,
        abi: erc20Abi,
        functionName: "approve",
        args: [contractAddress, grossTokens],
      });

      console.log("Approval transaction hash:", approveTxHash);
      if (!approveTxHash) {
        throw new Error("Approval transaction failed.");
      }

      console.log("Waiting for approval transaction confirmation...");
      const approvalReceipt = await waitForTransactionReceipt({
        hash: approveTxHash,
      });

      if (!approvalReceipt || !approvalReceipt.blockNumber) {
        throw new Error("Approval transaction not mined.");
      }

      console.log("Token approval confirmed!", approvalReceipt);
      alert("Approval successful. Now you can initialize the crowdsale.");
    } catch (error) {
      console.error("Error approving crowdsale:", error);
      alert("Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  const initialize = async () => {
    if (!details) {
      console.error("Crowdsale details not loaded yet.");
      return;
    }
    if (details.initialized) {
      console.error("Crowdsale is already initialized.");
      return;
    }
    if (userAddress?.toLowerCase() !== details.creator?.toLowerCase()) {
      console.error("Only the creator can initialize the crowdsale.");
      return;
    }

    setLoading(true);
    const grossTokens = parseEther(details.tokensForSale);
    try {
      console.log("Initializing crowdsale...");
      const initializeTxHash = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "initialize",
        args: [grossTokens],
      });

      console.log("Initialize transaction hash:", initializeTxHash);
      if (!initializeTxHash) {
        throw new Error("Initialization transaction failed.");
      }

      console.log("Waiting for initialization transaction confirmation...");
      const initializeReceipt = await waitForTransactionReceipt({
        hash: initializeTxHash,
      });

      if (!initializeReceipt || !initializeReceipt.blockNumber) {
        throw new Error("Initialization transaction not mined.");
      }

      console.log("Crowdsale initialized successfully!", initializeReceipt);
      alert("Crowdsale successfully initialized.");
    } catch (error) {
      console.error("Error initializing crowdsale:", error);
      alert("Initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Contribute to Crowdsale (amountInEth should be a string, e.g., "0.1")
  const contribute = async (amountInEth) => {
    setLoading(true);
    try {
      console.log("Contributing with amount (ETH):", amountInEth);
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "contribute",
        value: parseEther(amountInEth),
      });
      console.log("Contribute transaction:", tx);
      return tx;
    } catch (error) {
      console.error("Error contributing:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Finalize Crowdsale
  const finalizeCrowdsale = async () => {
    setLoading(true);
    try {
      console.log("Finalizing crowdsale...");
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "finalize",
      });
      console.log("Finalize transaction:", tx);
      return tx;
    } catch (error) {
      console.error("Error finalizing crowdsale:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. Claim Tokens
  const claimTokens = async () => {
    setLoading(true);
    try {
      console.log("Claiming tokens...");
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "claimToken",
      });
      console.log("Claim tokens transaction:", tx);
      return tx;
    } catch (error) {
      console.error("Error claiming tokens:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 5. Claim Refund
  const claimRefund = async () => {
    setLoading(true);
    try {
      console.log("Claiming refund...");
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "claimRefund",
      });
      console.log("Claim refund transaction:", tx);
      return tx;
    } catch (error) {
      console.error("Error claiming refund:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 5. sellStakeBack
  const sellStake = async () => {
    setLoading(true);
    try {
      console.log("selling...");
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CrowdsaleConfig.abi,
        functionName: "sellStakeBack",
      });
      console.log("Claim refund transaction:", tx);
      return tx;
    } catch (error) {
      console.error("Error claiming refund:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Read details
    details,
    detailsLoading,
    detailsError,
    approve,
    // Write interactions
    initialize,
    contribute,
    finalize: finalizeCrowdsale,
    claimTokens,
    claimRefund,
    sellStake,

    // Loading state for write interactions
    loading,
  };
}

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { tokenContractConfig, stakingContractConfig } from "./Contract";
import { waitForTransactionReceipt } from "viem/actions";

export function useStaking() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // Read total tokens staked by the staking contract
  const { data: totalTokenStaked } = useReadContract({
    ...tokenContractConfig,
    functionName: "balanceOf",
    args: [stakingContractConfig.address],
  });

  // Read pending dividends (only if we have an address)
  const { data: pendingDivs } = useReadContract({
    ...stakingContractConfig,
    functionName: "getPendingDivs",
    args: address ? [address] : [],
    enabled: !!address,
  });

  // Read staked tokens for the current user (only if we have an address)
  const { data: stakedToken } = useReadContract({
    ...stakingContractConfig,
    functionName: "depositedTokens",
    args: address ? [address] : [],
    enabled: !!address,
  });

  // Read total number of stakers
  const { data: totalStakers } = useReadContract({
    ...stakingContractConfig,
    functionName: "getNumberOfHolders",
  });

  // **Updated: Read token allowance for the staking contract with watch enabled**
  const { data: allowance } = useReadContract({
    ...tokenContractConfig,
    functionName: "allowance",
    args: address ? [address, stakingContractConfig.address] : [],
    enabled: !!address,
    watch: true, // This ensures the value is updated when the contract state changes
  });
  // If the allowance is greater than 0, consider it approved.
  const isApproved = allowance && allowance > 0n;

  // Write contract hook
  const { writeContractAsync } = useWriteContract();

  /**
   * Approve the staking contract to spend the user's tokens.
   * Here, we approve an "infinite" amount using the max uint256 value.
   */
  const approve = async () => {
    try {
      setProcessing(true);
      console.log("Starting approval...");

      const MAX_UINT256 =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const { hash: approveHash } = await writeContractAsync({
        ...tokenContractConfig,
        functionName: "approve",
        args: [stakingContractConfig.address, MAX_UINT256],
      });
      console.log("Approval transaction sent:", approveHash);

      // Wait for the approval transaction to be mined
      await waitForTransactionReceipt({ hash: approveHash });
      console.log("Approval confirmed!");
    } catch (error) {
      console.error("Approval transaction failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Stake tokens by depositing them into the staking contract.
   * (This should only be callable once approval is done.)
   */
  const stake = async () => {
    if (!isConnected || !address) {
      console.error("Wallet is not connected.");
      return;
    }

    if (!allowance || allowance < parseUnits(amount, 18)) {
      console.error("Not enough token allowance. Please approve first.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      console.error("Invalid staking amount.");
      return;
    }

    try {
      setProcessing(true);
      console.log("Starting staking (deposit)...");

      const parsedAmount = parseUnits(amount, 18);

      const txResponse = await writeContractAsync({
        ...stakingContractConfig,
        functionName: "deposit",
        args: [parsedAmount],
        account: address,
      });

      if (!txResponse || !txResponse.hash) {
        throw new Error("Transaction failed or was rejected.");
      }

      console.log("Stake transaction sent:", txResponse.hash);

      await waitForTransactionReceipt({ hash: txResponse.hash });
      console.log("Staking confirmed!");
    } catch (error) {
      console.error("Stake transaction failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const withdraw = async () => {
    if (!amount) return;
    try {
      setProcessing(true);
      console.log("Starting withdrawal...");

      const { hash: withdrawHash } = await writeContractAsync({
        ...stakingContractConfig,
        functionName: "withdraw",
        args: [parseUnits(amount, 18)],
        account: address,
      });
      console.log("Withdraw transaction sent:", withdrawHash);

      await waitForTransactionReceipt({ hash: withdrawHash });
      console.log("Withdrawal confirmed!");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const claimDividends = async () => {
    try {
      setProcessing(true);
      console.log("Starting claim dividends...");

      const { hash: claimHash } = await writeContractAsync({
        ...stakingContractConfig,
        functionName: "claimDivs",
      });
      console.log("Claim Dividends transaction sent:", claimHash);

      await waitForTransactionReceipt({ hash: claimHash });
      console.log("Claim Dividends confirmed!");
    } catch (error) {
      console.error("Claiming dividends failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  return {
    isConnected,
    amount,
    setAmount,
    approve,
    stake,
    withdraw,
    claimDividends,
    totalTokenStaked: totalTokenStaked
      ? Number(formatUnits(totalTokenStaked, 18)).toFixed(4)
      : "0.0000",
    pendingDivs: pendingDivs
      ? Number(formatUnits(pendingDivs, 18)).toFixed(4)
      : "0.0000",
    stakedToken: stakedToken
      ? Number(formatUnits(stakedToken, 18)).toFixed(4)
      : "0.0000",
    totalStakers,
    processing, // indicates if a transaction is currently being processed
    isApproved, // indicates whether approval has been granted
  };
}

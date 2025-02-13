import { useContractWrite } from "wagmi";
import { parseEther } from "viem"; // parseEther converts an ETH string to wei (as a bigint)
import { CrowdsaleConfig } from "./Contract";

// Your crowdsale contract ABI


export default function useCrowdsale(crowdsaleAddress) {
  // --- Contribute ---
  const contributeWrite = useContractWrite({
    address: CrowdsaleConfig.address,
    abi: CrowdsaleConfig.abi,
    functionName: "contribute",
  });

  // --- Claim Tokens ---
  const claimTokensWrite = useContractWrite({
    address: CrowdsaleConfig.address,
    abi: CrowdsaleConfig.abi,
    functionName: "claimTokens",
  });

  // --- Claim Refund ---
  const claimRefundWrite = useContractWrite({
    address: CrowdsaleConfig.address,
    abi: CrowdsaleConfig.abi,
    functionName: "claimRefund",
  });

  // --- Finalize ---
  const finalizeWrite = useContractWrite({
    address: CrowdsaleConfig.address,
    abi: CrowdsaleConfig.abi,
    functionName: "finalize",
  });

  // Call contribute by passing in an ETH amount as a string (e.g. "0.1")
  async function contribute(amountInEth) {
    try {
      // parseEther converts the ETH string to wei (bigint) as required by the contract.
      await contributeWrite.writeContractAsync({
        overrides: { value: parseEther(amountInEth) },
      });
      console.log("Contribution sent");
    } catch (err) {
      console.error("Error contributing:", err);
    }
  }

  async function claimTokens() {
    try {
      await claimTokensWrite.writeContractAsync();
      console.log("Tokens claimed");
    } catch (err) {
      console.error("Error claiming tokens:", err);
    }
  }

  async function claimRefund() {
    try {
      await claimRefundWrite.writeContractAsync();
      console.log("Refund claimed");
    } catch (err) {
      console.error("Error claiming refund:", err);
    }
  }

  async function finalize() {
    try {
      await finalizeWrite.writeContractAsync();
      console.log("Crowdsale finalized");
    } catch (err) {
      console.error("Error finalizing crowdsale:", err);
    }
  }

  return {
    contribute,
    claimTokens,
    claimRefund,
    finalize,
  };
}

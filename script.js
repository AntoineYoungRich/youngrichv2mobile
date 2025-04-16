const contractAddress = "0xeb9AA861f629A09ce544B669C9eb69A6426827c4";
const abi = [
  { "inputs": [], "stateMutability": "payable", "type": "function", "name": "deposit" },
  { "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "user", "type": "address"}], "name": "getBalance", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "contractBalance", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" }
];

let provider, signer, contract;

async function connect() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    updateInfos();
  } else {
    alert("MetaMask non détecté.");
  }
}

async function updateInfos() {
  const address = await signer.getAddress();
  const bal = await contract.getBalance(address);
  const reserve = await contract.contractBalance();
  const walletBal = await provider.getBalance(address);

  document.getElementById("userBalance").innerText = parseFloat(ethers.utils.formatEther(walletBal)).toFixed(4) + " POL";
  document.getElementById("totalCapital").innerText = parseFloat(ethers.utils.formatEther(bal)).toFixed(4) + " POL";
  document.getElementById("contractReserve").innerText = parseFloat(ethers.utils.formatEther(reserve)).toFixed(4) + " POL";
}

document.getElementById("connectBtn").onclick = connect;

document.getElementById("depositBtn").onclick = async () => {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) return alert("Montant invalide");
  const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  updateInfos();
};

document.getElementById("withdrawBtn").onclick = async () => {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) return alert("Montant invalide");
  const tx = await contract.withdraw(ethers.utils.parseEther(amount));
  await tx.wait();
  updateInfos();
};

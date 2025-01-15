const sha256=require('sha256');
//this imports sha and the 256 after it specifies the sha bit size which is 256
/* function Blockchain() {
    // Initialize properties, if any
    this.chain = [];
    this.pendingTransactions = [];
} */
class Blockchain {
    constructor (){
    this.chain = [];
    this.pendingTransaction = [];
    // give the genesis block a nonce, previous hash and hash of
    //zeros to begin with
    this.createNewBlock(100, '0', '0');
        }
}
Blockchain.prototype.createNewBlock=function(nonce,
    previousBlockHash,
    hash
){
    const newBlock={
        index:this.chain.length +1,
        timestamp: Date.now(),
        transactions:this.pendingTransactions,
        nonce:nonce,
        hash:hash,
        previousBlockHash:previousBlockHash
    };
    this.pendingTransactions=[];
    this.chain.push(newBlock);
    return newBlock;
};
Blockchain.prototype.getLastBlock=function(){
    return this.chain[this.chain.length -1];
};

Blockchain.prototype.proofOfWork = function(
        previousBlockHash,
        currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash,
        currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData,
        nonce);
        console.log(hash)
        }
        return nonce;
        };
Blockchain.prototype.createNewTransaction=function(amount,sender,recipient){
    const newTransaction={
        amount:amount,
        sender:sender,
        recipient:recipient,
    };
    this.pendingTransactions.push(newTransaction);
    return newTransaction;

};
Blockchain.prototype.addTransactionToPendingTransactions=function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index']+1;
};
Blockchain.prototype.hashBlock=function(previousBlockHash, currentBlockData,nonce){
    //The data string will consist of previous block, nonce and present block. This further makes the sc=ecret key generated difficult to compromise
    const dataAsString=previousBlockHash + nonce.toString()+JSON.stringify(currentBlockData);
    //the string is hashed next
    const hash=sha256(dataAsString);
    //the final hashed value is supplied next by method next
    return hash;
}
module.exports=Blockchain;
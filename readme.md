## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

## Takeaways
1. This project simplifies the process by let user enter their private key on the website, so that the client side can run code to generate signature. But usually this signing process should be carried out by wallet.
2. On the server side, it will receive `signature`, `msgHash`, `publicKey` etc. EXCEPT the private key. And with the info received, it is able to verify if the signature is signed by the person who owns the associated address, using `secp256k1.verify` method.
3. Q: I still can't think of a way to detect if someone has intercepted the transfered data and resent them again. Clearly only verification is not enough.  

**Update**: thanks for the help from @NakamotoNomad, his solution to the problem is add a valid-once consensys between client and server.   
To be specific, before client signs the tx, it first asks the server for a challenge, which includes a timestamp and a nonce. Server will also store the nonce. Then client will sign a message that contains the nonce and send back the exact challenge and corresponding signature.  
At server side, it will validate the signature and the nonce in challenge exists in its database. Once the tx is verified, the nonce will be discarded to avoid replay attack.  
For code implementation, check [this repo](https://github.com/NakamotoNomad/ecdsa-node).
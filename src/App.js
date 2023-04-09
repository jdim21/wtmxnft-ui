import logo from './logo.svg';
import './App.css';
import wtmLogoQuestion from './wtmLogoQuestion.png';
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { web3 } from '@coral-xyz/anchor';
import Button from '@mui/material/Button';
import { Input, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import CircularProgress from '@mui/material/CircularProgress';
import { bundlrStorage, keypairIdentity, walletAdapterIdentity } from "@metaplex-foundation/js";
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import ReactXnft, { SOLANA_CONNECT, useConnection } from 'react-xnft';
import { 
  AccountLayout, 
  createInitializeAccountInstruction, 
  createInitializeMintInstruction, 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  MintLayout, 
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PayerTransactionHandler } from '@metaplex-foundation/amman-client';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  createCreateStoreInstruction,
} from '@metaplex-foundation/mpl-fixed-price-sale';
import { toMetaplexFile, toMetaplexFileFromBrowser, toMetaplexFileFromJson } from '@metaplex-foundation/js';
// import { useNavigate } from "react-router-dom";

const nftData = {
  "name": "WhatsTheMeme",
  "symbol": "WTM"
}

const memePublicKey = new PublicKey("MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6");
const wtmMintAddress = "WTMxC9P6LAT3pPUA8rFRQ5fSKP6zG7sFxTUUvaDiavD";
const wtmPublicKey = new PublicKey(wtmMintAddress);
const URI = "https://arweave.net/O08SXje_2DOyoqRFjneIKre6Y_Ota-u6i_o_YGKPuAM";
const NAME = nftData.name;
const SYMBOL = nftData.symbol;
const SELLER_FEE_BASIS_POINTS = 250;
const secondUri = "https://arweave.net/zQ960-IG6Xc0QWfjG5T6bDN04Poa8Cs6YrF47WdemQk";
const MEME_WTM_TOKEN_ACCOUNT_ADDRESS = "74v5YpBD3vEdekiXg2FmFjMduQa4jKCRUWGVBwGFTMNf";
const baseJson = { "token_id": "0", "name": "WTM", "description": "WhatsTheMeme", "seller_fee_basis_points": 250, "image": "https://arweave.net/iyD5hhdBXvkuZSb-cGgp20rfe7vNCSZRtgPvFTIIxl0", "external_url": "", "attributes": [{ "display_type": null, "trait_type": "Message", "value": "What's the meme?" }], "properties": { "files": [{ "uri": "https://arweave.net/iyD5hhdBXvkuZSb-cGgp20rfe7vNCSZRtgPvFTIIxl0", "type": "image/png" }], "category": "image", "creators": [{ "address": "MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6", "share": 100 }] } };

const xNFTPubKey = () => {
  return window.xnft?.solana?.publicKey;
}

const xNFTWallet = () => {
  return window.xnft?.solana;
}

const xNFTConnection = () => {
  return window.xnft?.solana?.connection;
}

const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  } else if ('xnft' in window) {
    const provider = window.xnft?.solana;
    return provider;
  }
  window.open('https://phantom.app/', '_blank');
};

// async function DoStuff(connection, publicKey, wallet) {
async function DoStuff(connection, publicKey) {
  console.log("DoStuff()..");
  console.log("connection: ", connection);
  console.log("publicKey: ", publicKey);
  const metaplex = new Metaplex(connection);
  console.log("metaplex: ", metaplex);
  // metaplex.use(walletAdapterIdentity(wallet))
  metaplex.use(walletAdapterIdentity(window.xnft.solana))
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "My NFT2",
    description: "My description",
    image: "https://arweave.net/D7KFPD8XDM7mFjUNO5YpBoEqatO54gjy1Zt7j3PZM_E",
  });
  console.log("uri: ", uri);
}

async function ChangeNft(connection, publicKey) {
  console.log("ChangeNft()..");
  console.log("connection: ", connection);
  console.log("publicKey: ", publicKey);
  const metaplex = new Metaplex(connection);
  console.log("metaplex: ", metaplex);
  // metaplex.use(walletAdapterIdentity(wallet))
  metaplex.use(walletAdapterIdentity(window.xnft.solana))
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "My NFT2",
    description: "My description",
    image: "https://arweave.net/D7KFPD8XDM7mFjUNO5YpBoEqatO54gjy1Zt7j3PZM_E",
  });
  console.log("uri: ", uri);
}

// async function updateMetadata(connection, wallet, currFileToUpload, currMessageToUpload) {
//   console.log("updateMetadata()..");
//   // console.log("wallet: ", wallet);
//   // console.log("connection: ", connection);
//   // const connection = useConnection();
//   // console.log("wallet after connect(): ", wallet);
//   // await wallet.connect();
//   // const connection = new Connection("https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2");
//   const metaplex = Metaplex.make(connection)
//     .use(walletAdapterIdentity(wallet))
//     // .use(walletAdapterIdentity(window.xnft.solana))
//     // .use(keypairIdentity(memeKeypair))
//     .use(bundlrStorage({
//         address: 'https://node1.bundlr.network',
//         providerUrl: 'https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2',
//         timeout: 60000,
//     }));
//   console.log("currFileToUpload: ", currFileToUpload);
//   const imageFile = await toMetaplexFileFromBrowser(currFileToUpload);
//   metaplex.storage().upload(imageFile).then(res => {
//     console.log("res image upload: ", res);
//     var uploadJson = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"' +
//     JSON.parse(JSON.stringify(res)) +
//     '","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"' +
//     JSON.parse(JSON.stringify(currMessageToUpload)) +
//     '"}],"properties":{"files":[{"uri":"' +
//     JSON.parse(JSON.stringify(res)) +
//     '","type":"image\/png"}],"category":"image","creators":[{"address":"MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6","share":100}]}}';
//     console.log("uploadJson: ", uploadJson);
//     // const jsonFileUpload = toMetaplexFileFromJson(uploadJson);
//     const jsonFileUpload = toMetaplexFile(uploadJson, 'newMeme.json');
//     metaplex.storage().upload(jsonFileUpload).then(async jsonRes => {
//       console.log("jsonRes: ", jsonRes);
//       const mintAddress = wtmMintAddress;
//       const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
//       metaplex.use(keypairIdentity(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY)))));
//       const res = await metaplex.nfts().update({ 
//         nftOrSft: nft,
//         uri: jsonRes
//       });
//       console.log("Done updating. res: ", res);
//       checkForCurrentMeme();
//     }).catch(e => {
//       console.log("Error uploading metadata json: ", e);
//     })
//   }).catch(e => {
//     console.log("Error uploading image: ", e);
//   })
//   return;
//   //   const imageFileUpload = toMetaplexFileFromJson(uploadJson);
//   //   var uploadJson = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"newImageUriHere","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"newMessageHere"}],"properties":{"files":[{"uri":"newImageUriHere","type":"image\/png"}],"category":"image","creators":[{"address":"0x2d6070C8834BEAB74d6496DbC59B76c761137f33","share":100}]}}';
//   //   // uploadJson.replace("newMessageHere", JSON.parse(JSON.stringify(currMessageToUpload)));
//   //   // uploadJson.replace("newImageUriHere", JSON.parse(JSON.stringify(newlyUploadedImageUri)));
//   //   // console.log("file buffer: ", file.buffer);
//   //   // console.log("metaplex: ", metaplex);
//   //   // console.log("metaplex.storage: ", metaplex.storage);
//   //     console.log("upload res: ", res);
//   //   return;
//   // return;
//   // const baseUri = "https://arweave.net/O08SXje_2DOyoqRFjneIKre6Y_Ota-u6i_o_YGKPuAM";
//   // const wojakUri = "https://arweave.net/6JyiDqWHSKT9XLrMoDIva5qgYMx4wXqdZNWMF0HXxB4";
//   // const mintAddress = wtmMintAddress;
//   // const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
//   // const res = await metaplex.nfts().update({ 
//   //   nftOrSft: nft,
//   //   uri: baseUri
//   // });
//   // console.log("Done updating. res: ", res);
//   // await metaplex.nfts().create({
//   //   tokenStandard: TokenStandard.ProgrammableNonFungible,
//   //   uri: wojakUri,//baseUri, // metadata URI
//   //   name: nftData.name,
//   //   sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
//   //   symbol: nftData.symbol,
//   //   creators: [{
//   //     address: wallet.publicKey,
//   //     share: 100,
//   //   }],
//   //   tokenStandard: 0,
//   //   maxSupply: 5,
//   //   isMutable: true,
//   // },
//   //   { commitment: "finalized" },
//   // );

// }

async function changeWtmNFT(
  connection = null,
  payer = null,
) {
  const provider = getProvider();
  console.log("provider: ", provider);
  // const payer = xNFTWallet();
  if (connection == null || payer == null) {
    payer = xNFTPubKey();
    console.log("just set payer: ", payer);
    connection = xNFTConnection();
  }
  console.log("payer: ", payer);
  console.log("connection: ", connection);

  const metaplex = new Metaplex(connection);
  console.log("metaplex: ", metaplex);
  // metaplex.use(walletAdapterIdentity(wallet))
  metaplex.use(walletAdapterIdentity(window.xnft.solana))
  // metaplex.use(keypairIdentity(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY)))));
  var newMetadata = baseJson;
  // newMetadata.image = "https://arweave.net/D7KFPD8XDM7mFjUNO5YpBoEqatO54gjy1Zt7j3PZM_E"; // anime
  newMetadata.image = "https://arweave.net/I6ROL4LwxwXR4x9IBwgcsXrDRHcUPm4Fs2Q6lBbcT8E"; // wojak
  // newMetadata.properties.files[0].uri = "https://arweave.net/D7KFPD8XDM7mFjUNO5YpBoEqatO54gjy1Zt7j3PZM_E"; // anime
  newMetadata.properties.files[0].uri = "https://arweave.net/I6ROL4LwxwXR4x9IBwgcsXrDRHcUPm4Fs2Q6lBbcT8E";
  newMetadata.attributes[0].value = "AHHHHH!";
  console.log("newMetadata: ", newMetadata);
  const { uri } = await metaplex.nfts().uploadMetadata(newMetadata);
  console.log("uri: ", uri);

  const mintAddress = wtmMintAddress;
  const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
  metaplex.use(keypairIdentity(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY)))));
  const updateRes = await metaplex.nfts().update({ 
    nftOrSft: nft,
    uri: uri
  });
  console.log("Done updating. res: ", updateRes);
  return;
}

async function mintWtmNFT(
  connection = null,
  payer = null,
) {
  const provider = getProvider();
  console.log("provider: ", provider);
  // const payer = xNFTWallet();
  if (connection == null || payer == null) {
    payer = xNFTPubKey();
    console.log("just set payer: ", payer);
    connection = xNFTConnection();
  }
  console.log("payer: ", payer);
  console.log("connection: ", connection);
  var transaction = new web3.Transaction();

  const associatedDestinationTokenAddr = await getAssociatedTokenAddress(
    wtmPublicKey,
    payer
  );
  const accountInfo = await connection.getAccountInfo(associatedDestinationTokenAddr)
  const exists = accountInfo !== null
  if (!exists) {
    const createTokenAccountIx = (
      createAssociatedTokenAccountInstruction(
        payer,
        associatedDestinationTokenAddr,
        payer,
        wtmPublicKey
      )
    );
    console.log("createTokenAccountIx: ", createTokenAccountIx);
    transaction.add(createTokenAccountIx);
  } else {
    console.log("token account already exists");
  }

  const createTransferIx = createTransferInstruction(
    new PublicKey(MEME_WTM_TOKEN_ACCOUNT_ADDRESS),
    associatedDestinationTokenAddr,
    memePublicKey,
    1
  );
  console.log("createTransferIx: ", createTransferIx);
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash
  transaction.feePayer = payer;
  transaction.add(createTransferIx);
  // transaction.setSigners([memePublicKey, provider.publicKey]);
  // transaction.add(createTokenAccountIx);
  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: memePublicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.01
    }),
  );
  transaction.partialSign(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY))));

  // console.log("memeKeypair: ", memeKeypair);
  // transaction.partialSign(memeKeypair);

  // const res = await provider.signAndSendTransaction(transaction, [memeKeypair]);
  console.log("transaction: ", transaction);
  // const res = await provider.signAndSendTransaction(transaction);
  const res = await provider.send(transaction);
  console.log("res: ", res);
  return;
}

async function DoStuffWorksWithPhantom(wallet, connection) {
  console.log("DoStuffWorksWithPhantom()..");
  console.log("wallet: ", wallet);
  console.log("connection: ", connection);
  // const connection = useConnection();
  console.log("wallet after connect(): ", wallet);
  await wallet.connect();
  const txHandler = new PayerTransactionHandler(connection, wallet);
  let mint = new PublicKey("6xfa7sbz5iRtUssYnTLYGKuuec9Hf9AMwPNdG4M2MRvu");
  // const metaplex = Metaplex.make(connection);
  // const pdas = metaplex.nfts().pdas();
  // const edition = pdas.edition({ mint: mint });
  // console.log("edition: ", edition);
  // console.log("edition.bump: ", edition.bump);
  // console.log("txHandler: ", txHandler);
  // return;
}

function App() { 
  // const theme = useTheme();
  // let navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [sendingChangeTransaction, setSendingChangeTransaction] = useState(false);
  const [currWtmImage, setCurrWtmImage] = useState(null);
  const [currWtmMessage, setCurrWtmMessage] = useState("");
  const [currFileToUpload, setNewFileToUpload] = useState(null);
  const [currFileNameToUpload, setNewFileNameToUpload] = useState("<none>");
  const [currMessageToUpload, setNewMessageToUpload] = useState("");
  const endpoint = web3.clusterApiUrl("mainnet-beta");
  const walletPhantom = new PhantomWalletAdapter();
  const connection = new Connection("https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2");
  walletPhantom.connect().then(res => {
    mintWtmNFT(connection, walletPhantom);
  }).catch(e => {
    console.log("err doing stuff: ", e);
  });
  // updateMetadata(connection, walletPhantom.publicKey);
  // const metaplex = new Metaplex(wallet.connection);
  // metaplex.use(walletAdapterIdentity(wallet));
  // metaplex.nfts().uploadMetadata({
  //   name: "My NFT2",
  //   description: "My description",
  //   image: "https://arweave.net/D7KFPD8XDM7mFjUNO5YpBoEqatO54gjy1Zt7j3PZM_E",
  // }).then(res => {
  //   console.log("res: ", res);
  // }).catch(e => {
  //   console.log("error: ", e);
  // });
  // useEffect(() => {
  //   console.log("HUH");
  //   console.log("wallet: ", wallet);
  //   console.log("connection: ", connection);
  //   if (wallet && connection) {
  //     DoStuff2(wallet, connection);
  //     // setLoaded(true);
  //   }
  // }, [wallet, connection]);
  useEffect(() => {
  }, []);

  const checkForCurrentMeme = () => {
    console.log("Checking for current meme..");
    if (window.xnft?.solana?.publicKey) {
      console.log("Found connected xnft");
      const metaplex = Metaplex.make(window.xnft.solana.connection).use(keypairIdentity(window.xnft.solana));
      metaplex.nfts().findByMint({ mintAddress: wtmPublicKey }).then(nft => {
        console.log("fetchCurrNft: ", nft);
        if (nft?.json?.image) {
          console.log("image: ", nft.json.image);
          setCurrWtmImage(nft.json.image);
          if (nft.json.attributes && nft.json.attributes[0].value) {
            setCurrWtmMessage(nft.json.attributes[0].value);
          }
        }
      });
      // DoStuff(window.xnft.solana.connection, window.xnft.solana.publicKey);
      // updateMetadata(window.xnft.solana.connection, window.xnft.solana.publicKey);
      setLoaded(true);
    }
  };

  useEffect(() => {
    console.log("pk: ", xNFTPubKey());
    console.log("solana: ", window.xnft.solana.connection);
    checkForCurrentMeme();
    // if (window.xnft?.solana?.publicKey) {
    //   const metaplex = Metaplex.make(window.xnft.solana.connection).use(keypairIdentity(window.xnft.solana));
    //   metaplex.nfts().findByMint({ mintAddress: wtmPublicKey }).then(nft => {
    //     console.log("fetchCurrNft: ", nft);
    //     if (nft?.json?.image) {
    //       console.log("image: ", nft.json.image);
    //       setCurrWtmImage(nft.json.image);
    //       if (nft.json.attributes && nft.json.attributes[0].value) {
    //         setCurrWtmMessage(nft.json.attributes[0].value);
    //       }
    //     }
    //   });
    //   // DoStuff(window.xnft.solana.connection, window.xnft.solana.publicKey);
    //   // updateMetadata(window.xnft.solana.connection, window.xnft.solana.publicKey);
    //   setLoaded(true);
    // }
  }, [xNFTPubKey()]);


  // const handleNewFileSelected = async (e) => {
  const handleNewFileSelected = (e) => {
    if (!e.target.files) {
      console.log("Aborting.");
      return;
    }
    setNewFileNameToUpload(e.target.files[0].name);
    // setNewFileToUpload(await e.target.files[0].arrayBuffer());
    setNewFileToUpload(e.target.files[0]);
  }

  const handleNewWtmMessage = e => {
    if (!e.target.value) {
      console.log("Aborting.");
      return;
    }
    setNewMessageToUpload(e.target.value);
  }

  const changeTheMeme = e => {
    if (!currFileToUpload) {
      console.log("No file selected.");
      return;
    }
    console.log("Changing the meme..");
    console.log("Curr message: ", currMessageToUpload);
  }

  async function updateMetadata(connection, wallet, currFileToUpload, currMessageToUpload) {
    console.log("updateMetadata()..");
    setSendingChangeTransaction(true);
    try {
      // console.log("wallet: ", wallet);
      // console.log("connection: ", connection);
      // const connection = useConnection();
      // console.log("wallet after connect(): ", wallet);
      // await wallet.connect();
      // const connection = new Connection("https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2");
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        // .use(walletAdapterIdentity(window.xnft.solana))
        // .use(keypairIdentity(memeKeypair))
        .use(bundlrStorage({
          address: 'https://node1.bundlr.network',
          providerUrl: 'https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2',
          timeout: 60000,
        }));
      console.log("currFileToUpload: ", currFileToUpload);
      const imageFile = await toMetaplexFileFromBrowser(currFileToUpload);
      metaplex.storage().upload(imageFile).then(res => {
        console.log("res image upload: ", res);
        var uploadJson = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"' +
          JSON.parse(JSON.stringify(res)) +
          '","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"' +
          JSON.parse(JSON.stringify(currMessageToUpload)) +
          '"}],"properties":{"files":[{"uri":"' +
          JSON.parse(JSON.stringify(res)) +
          '","type":"image\/png"}],"category":"image","creators":[{"address":"MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6","share":100}]}}';
        console.log("uploadJson: ", uploadJson);
        // const jsonFileUpload = toMetaplexFileFromJson(uploadJson);
        const jsonFileUpload = toMetaplexFile(uploadJson, 'newMeme.json');
        metaplex.storage().upload(jsonFileUpload).then(async jsonRes => {
          console.log("jsonRes: ", jsonRes);
          const mintAddress = wtmMintAddress;
          const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
          metaplex.use(keypairIdentity(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY)))));
          const res = await metaplex.nfts().update({
            nftOrSft: nft,
            uri: jsonRes
          });
          console.log("Done updating. res: ", res);
          setSendingChangeTransaction(false);
          setTimeout(checkForCurrentMeme, 1000);
        }).catch(e => {
          console.log("Error uploading metadata json: ", e);
          setSendingChangeTransaction(false);
        })
      }).catch(e => {
        console.log("Error uploading image: ", e);
        setSendingChangeTransaction(false);
      })

    } catch (e) {
      console.log("Error updating metadata: ", e);
      setSendingChangeTransaction(false);
    }
    return;
    //   const imageFileUpload = toMetaplexFileFromJson(uploadJson);
    //   var uploadJson = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"newImageUriHere","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"newMessageHere"}],"properties":{"files":[{"uri":"newImageUriHere","type":"image\/png"}],"category":"image","creators":[{"address":"0x2d6070C8834BEAB74d6496DbC59B76c761137f33","share":100}]}}';
    //   // uploadJson.replace("newMessageHere", JSON.parse(JSON.stringify(currMessageToUpload)));
    //   // uploadJson.replace("newImageUriHere", JSON.parse(JSON.stringify(newlyUploadedImageUri)));
    //   // console.log("file buffer: ", file.buffer);
    //   // console.log("metaplex: ", metaplex);
    //   // console.log("metaplex.storage: ", metaplex.storage);
    //     console.log("upload res: ", res);
    //   return;
    // return;
    // const baseUri = "https://arweave.net/O08SXje_2DOyoqRFjneIKre6Y_Ota-u6i_o_YGKPuAM";
    // const wojakUri = "https://arweave.net/6JyiDqWHSKT9XLrMoDIva5qgYMx4wXqdZNWMF0HXxB4";
    // const mintAddress = wtmMintAddress;
    // const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
    // const res = await metaplex.nfts().update({ 
    //   nftOrSft: nft,
    //   uri: baseUri
    // });
    // console.log("Done updating. res: ", res);
    // await metaplex.nfts().create({
    //   tokenStandard: TokenStandard.ProgrammableNonFungible,
    //   uri: wojakUri,//baseUri, // metadata URI
    //   name: nftData.name,
    //   sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
    //   symbol: nftData.symbol,
    //   creators: [{
    //     address: wallet.publicKey,
    //     share: 100,
    //   }],
    //   tokenStandard: 0,
    //   maxSupply: 5,
    //   isMutable: true,
    // },
    //   { commitment: "finalized" },
    // );

  }

  const changeTheMemeButtonClick = () => {
    updateMetadata(connection, window.xnft.solana, currFileToUpload, currMessageToUpload); 
    // checkForCurrentMeme();
  }

  const changeTheMemeButtonStyle = () => {
    if (sendingChangeTransaction) {
      return (
        <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} >
          <CircularProgress style={{ marginRight: "1rem" }} />
          UPLOADING
        </Button>
      )
    }
    return (
        <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={changeTheMemeButtonClick}>CHANGE THE MEME</Button>
    )
  }

  const bottomSection = () => {
    if (isChanging == true) {
      return (
        <div>
          <div>
            <Input label="Standard" variant="standard" type="file" accept=".png, .jpg, .gif" onChange={handleNewFileSelected} />
          </div>
          <div>
            <TextField id="wtm-message-input" label="Message" variant="standard" onChange={handleNewWtmMessage} />
          </div>
          <div>
            <IconButton size="small" sx={{ mt: "1rem", mr: 1 }} style={{ color: theme.palette.primary.light }} onClick={() => setIsChanging(false)} aria-label="refresh button" component="label">
              <ArrowBackIcon />
            </IconButton>
            {changeTheMemeButtonStyle()}
          </div>
        </div>
      )
    }
    return (
      <span>
      {/* <Button onClick={mintWtmNFT}>MINT</Button> */}
      {/* TODO: disable on minted out */}
      <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{":hover": {bgcolor: theme.palette.primary.main}, color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={mintWtmNFT}>MINT</Button>
      {/* <Button onClick={changeWtmNFT}>CHANGE</Button> */}
      <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{":hover": {bgcolor: theme.palette.primary.main}, color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={() => setIsChanging(true)}>CHANGE</Button>
      {/* <Button onClick={()=>console.log('change..')}>CHANGE</Button> */}
      </span>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[walletPhantom]}></WalletProvider>
        <div className="App">
          <header className="App-header">
            <Typography color={theme.palette.primary.light} sx={{ pt: 2, pb: 1, mb: 5 }} variant="h5" fontWeight="bold">
              <IconButton size="small" sx={{ml: 1}} style={{color:theme.palette.primary.light}} onClick={() => checkForCurrentMeme()} aria-label="refresh button" component="label">
                <RefreshIcon />
              </IconButton>
              What's the meme?
            </Typography>
            <img className="currMeme" src={currWtmImage ? currWtmImage : wtmLogoQuestion} />
            <Typography color={theme.palette.primary.light} sx={{ pt: 2, pb: 1 }} variant="h5" fontWeight="bold">
            {currWtmMessage == "" ? "<Message>" : currWtmMessage}</Typography>
            <br></br>
            {bottomSection()}
            {/* <span> */}
              {/* <Button onClick={mintWtmNFT}>MINT</Button> */}
              {/* TODO: disable on minted out */}
              {/* <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{":hover": {bgcolor: theme.palette.primary.main}, color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={mintWtmNFT}>MINT</Button> */}
              {/* <Button onClick={changeWtmNFT}>CHANGE</Button> */}
              {/* <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{":hover": {bgcolor: theme.palette.primary.main}, color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={() => console.log("change..")}>CHANGE</Button> */}
              {/* <Button onClick={()=>console.log('change..')}>CHANGE</Button> */}
            {/* </span> */}
            {/* <text>{loaded ? "ready: " + JSON.stringify(xNFTPubKey()) : "not ready."}</text> */}
          </header>
        </div>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;

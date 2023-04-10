import './App.css';
import wtmLogoQuestion from './wtmLogoQuestion.png';
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { web3 } from '@coral-xyz/anchor';
import Button from '@mui/material/Button';
import { Input, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import CircularProgress from '@mui/material/CircularProgress';
import { SOL, bundlrStorage, keypairIdentity, walletAdapterIdentity } from "@metaplex-foundation/js";
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { toMetaplexFile, toMetaplexFileFromBrowser } from '@metaplex-foundation/js';

const memePublicKey = new PublicKey("MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6");
const wtmMintAddress = "WTMxC9P6LAT3pPUA8rFRQ5fSKP6zG7sFxTUUvaDiavD";
const wtmPublicKey = new PublicKey(wtmMintAddress);
const MEME_WTM_TOKEN_ACCOUNT_ADDRESS = "74v5YpBD3vEdekiXg2FmFjMduQa4jKCRUWGVBwGFTMNf";
const SOL_PER_MEME_CHANGE = 0.01;

const xNFTPubKey = () => {
  return window.xnft?.solana?.publicKey;
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

async function mintWtmNFT(
  connection = null,
  payer = null,
) {
  const provider = getProvider();
  console.log("provider: ", provider);
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
    transaction.add(createTokenAccountIx);
  }

  const createTransferIx = createTransferInstruction(
    new PublicKey(MEME_WTM_TOKEN_ACCOUNT_ADDRESS),
    associatedDestinationTokenAddr,
    memePublicKey,
    1
  );
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash
  transaction.feePayer = payer;
  transaction.add(createTransferIx);
  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: memePublicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.01
    }),
  );
  transaction.partialSign(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY))));

  const res = await provider.send(transaction);
  console.log("res: ", res);
  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: res,
  });
  console.log("confirmed mint.");
  return;
}

function App() { 
  const [loaded, setLoaded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMissingNftError, setIsMissingNftError] = useState(false);
  const [sendingChangeTransaction, setSendingChangeTransaction] = useState(false);
  const [currWtmImage, setCurrWtmImage] = useState(null);
  const [currWtmMessage, setCurrWtmMessage] = useState("");
  const [currFileToUpload, setNewFileToUpload] = useState(null);
  const [currMessageToUpload, setNewMessageToUpload] = useState("");
  const endpoint = web3.clusterApiUrl("mainnet-beta");
  const walletPhantom = new PhantomWalletAdapter();
  const connection = new Connection("https://rpc.helius.xyz/?api-key=b60951f5-4f7c-4400-bf33-fab766f192d2");
  console.log("provider: ", getProvider());
  // walletPhantom.connect().then(res => {
  //   console.log("Phantom connected.");
  // }).catch(e => {
  //   console.log("err doing stuff: ", e);
  // });

  const checkForCurrentMeme = () => {
    if (window.xnft?.solana?.publicKey) {
      const metaplex = Metaplex.make(window.xnft.solana.connection).use(keypairIdentity(window.xnft.solana));
      metaplex.nfts().findByMint({ mintAddress: wtmPublicKey }).then(nft => {
        if (nft?.json?.image) {
          setCurrWtmImage(nft.json.image);
          if (nft.json.attributes && nft.json.attributes[0].value) {
            setCurrWtmMessage(nft.json.attributes[0].value);
          }
        }
      });
      setLoaded(true);
    }
  };

  useEffect(() => {
    checkForCurrentMeme();
  }, [xNFTPubKey()]);


  const handleNewFileSelected = (e) => {
    if (!e.target.files) {
      console.log("Aborting.");
      return;
    }
    setNewFileToUpload(e.target.files[0]);
  }

  const handleNewWtmMessage = e => {
    if (!e.target.value) {
      console.log("Aborting.");
      return;
    }
    setNewMessageToUpload(e.target.value);
  }

  async function updateMetadata(connection, wallet, currFileToUpload, currMessageToUpload) {
    setSendingChangeTransaction(true);
    try {
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({
          address: 'https://node1.bundlr.network',
          providerUrl: 'https://rpc.helius.xyz/?api-key=d87ce4c4-7cf4-4a6f-9d8c-70df9c619c69',
          timeout: 60000,
        }));
      const imageFile = await toMetaplexFileFromBrowser(currFileToUpload);
      metaplex.storage().upload(imageFile).then(res => {
        var uploadJson = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"' +
          JSON.parse(JSON.stringify(res)) +
          '","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"' +
          JSON.parse(JSON.stringify(currMessageToUpload)) +
          '"}],"properties":{"files":[{"uri":"' +
          JSON.parse(JSON.stringify(res)) +
          '","type":"image\/png"}],"category":"image","creators":[{"address":"MEMEA5AkEkNgjuuwY4pkmVoKJDFBJJ4sZHGU1kvaWT6","share":100}]}}';
        const jsonFileUpload = toMetaplexFile(uploadJson, 'newMeme.json');
        metaplex.storage().upload(jsonFileUpload).then(async jsonRes => {
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(window.xnft.solana.publicKey),
              toPubkey: new PublicKey("memenEiTFphsDQPRzKCi8SACPySqGBcYYRra14Ugx3V"),
              lamports: web3.LAMPORTS_PER_SOL * SOL_PER_MEME_CHANGE,
            })
          );
          
          transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
          ).blockhash
          transaction.feePayer = new PublicKey(window.xnft.solana.publicKey);
          
          const signed = await window.xnft.signTransaction(transaction);
          const txResult = await window.xnft.solana.send(signed);
          const mintAddress = wtmMintAddress;
          const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
          metaplex.use(keypairIdentity(Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.REACT_APP_MEME_PRIVATE_KEY)))));
          const res = await metaplex.nfts().update({
            nftOrSft: nft,
            uri: jsonRes
          });
          console.log("Done updating. result: ", res);
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
  }

  const changeTheMemeButtonClick = () => {
    updateMetadata(connection, window.xnft.solana, currFileToUpload, currMessageToUpload); 
  }

  const connectWallet = () => {
    console.log("Connecting wallet..");
    console.log("getProvider: ", getProvider());
    const walletPhantom = new PhantomWalletAdapter();
    walletPhantom.connect().then(res => {
      console.log("Phantom connected.");
    })
  }

  const changeTheMemeButtonStyle = () => {
    if (sendingChangeTransaction) {
      return (
        <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} >
          <CircularProgress style={{ size: "0.2rem", marginRight: "1rem" }} />
          UPLOADING
        </Button>
      )
    }
    return (
        <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={changeTheMemeButtonClick}>CHANGE THE MEME</Button>
    )
  }

  const callMintWtmNFT = async () => {
    setIsMinting(true);
    setIsMissingNftError(false);
    try {
      await mintWtmNFT();
    } catch (e) {
      console.log("Error minting: ", e);
    }
    setIsMinting(false);
  }

  const handleChangeClick = async () => {
    setIsMissingNftError(false);
    const provider = getProvider();
    let accounts = await provider.connection.getTokenAccountsByOwner(
      provider.publicKey,
      {
        mint: new PublicKey(wtmMintAddress)
      }
    );

    if (accounts && accounts.value[0] && accounts.value[0].pubkey) {
      let balance = await provider.connection.getTokenAccountBalance(
        accounts.value[0].pubkey
      )
      if (balance && balance.value && balance.value.amount >= 1) {
        setIsChanging(true);
        return;
      }
    }
    setIsMissingNftError(true);
  }

  const bottomSection = () => {
    const provider = getProvider();
    if (provider && (provider.isConnected || provider.connection)) {
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
      if (isMinting) {
        return (
          <span>
            {/* TODO: disable on minted out */}
            <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={callMintWtmNFT}>
              <CircularProgress style={{ marginRight: "1rem" }} />
              MINT
            </Button>
            <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={() => handleChangeClick()}>CHANGE</Button>
            <div>
              {isMissingNftError ? <Typography color={"#ff0033"} sx={{ pt: 0.5, pb: 1, mb: 5 }} variant="caption" fontWeight="bold">MISSING WTM NFT</Typography> : <span/>}
            </div>
          </span>
        )
      } else {
        return (
          <span>
            {/* TODO: disable on minted out */}
            <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={callMintWtmNFT}>MINT</Button>
            <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={() => handleChangeClick()}>CHANGE</Button>
            <div>
              {isMissingNftError ? <Typography color={"#ff0033"} sx={{ pt: 0.5, pb: 1, mb: 5 }} variant="caption" fontWeight="bold">MISSING WTM NFT</Typography> : <span/>}
            </div>
          </span>
        )
      }
    }
    return (
      <span>
        <Button variant="contained" style={{ marginTop: "1rem", marginRight: "1rem" }} sx={{ ":hover": { bgcolor: theme.palette.primary.main }, color: 'primary.dark', backgroundColor: 'primary.light' }} onClick={connectWallet}>CONNECT</Button>
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
              <IconButton size="small" sx={{ ml: 1 }} style={{ color: theme.palette.primary.light }} onClick={() => checkForCurrentMeme()} aria-label="refresh button" component="label">
                <RefreshIcon />
              </IconButton>
              What's the meme?
            </Typography>
            <img className="currMeme" src={currWtmImage ? currWtmImage : wtmLogoQuestion} />
            <Typography color={theme.palette.primary.light} sx={{ pt: 2, pb: 1 }} variant="h5" fontWeight="bold">
              {currWtmMessage == "" ? "<Message>" : currWtmMessage}</Typography>
            <br></br>
            {bottomSection()}
          </header>
        </div>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;

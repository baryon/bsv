/* eslint-disable @typescript-eslint/ban-types */
// Type definitions for bsv 1.5.5
// Project: https://github.com/moneybutton/bsv
// Forked From: https://github.com/bitpay/bitcore-lib
// Definitions by: Lautaro Dragan <https://github.com/lautarodragan>
// Definitions extended by: David Case <https://github.com/shruggr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// TypeScript Version: 2.2
declare module 'bsv' {
  export namespace encoding {
    class Base58 {}
    class Base58Check {}
    class BufferReader {
      readUInt8(): number;
      readUInt16BE(): number;
      readUInt16LE(): number;
      readUInt32BE(): number;
      readUInt32BE(): number;
      readInt32LE(): number;
      readUInt64BEBN(): number;
      readUInt64LEBN(): number;
      readVarintNum(): number;
      readVarLengthBuffer(): Buffer;
      readVarintBuf(): Buffer;
      readVarintBN(): crypto.BN;
      reverse(): this;
      readReverse(len: number): Buffer;
    }
    class BufferWriter {
      writeUInt8(n: number): this;
      writeUInt16BE(n: number): this;
      writeUInt16LE(n: number): this;
      writeUInt32BE(n: number): this;
      writeUInt32LE(n: number): this;
      writeInt32LE(n: number): this;
      writeUInt64BEBN(n: number): this;
      writeUInt64LEBN(n: number): this;
      writeVarintNum(n: number): this;
      writeVarintBN(n: crypto.BN): this;
      writeReverse(buf: Buffer): this;
      toBuffer(): Buffer;
    }
    class Varint {}
  }

  export namespace crypto {
    class BN {
      constructor(number: number | string | number[] | Uint8Array | Buffer | BN, base?: number | 'hex');
      toBuffer(): Buffer;
    }

    namespace ECDSA {
      function sign(message: Buffer, key: PrivateKey): Signature;
      function verify(hashbuf: Buffer, sig: Signature, pubkey: PublicKey, endian?: 'little'): boolean;
    }

    namespace Hash {
      function sha1(buffer: Buffer): Buffer;
      function sha256(buffer: Buffer): Buffer;
      function sha256sha256(buffer: Buffer): Buffer;
      function sha256ripemd160(buffer: Buffer): Buffer;
      function sha512(buffer: Buffer): Buffer;
      function ripemd160(buffer: Buffer): Buffer;

      function sha256hmac(data: Buffer, key: Buffer): Buffer;
      function sha512hmac(data: Buffer, key: Buffer): Buffer;
    }

    namespace Random {
      function getRandomBuffer(size: number): Buffer;
    }

    class Point {
      static fromX(odd: boolean, x: BN | string): Point;
      static getG(): any;
      static getN(): BN;
      getX(): BN;
      getY(): BN;
      validate(): this;
      mul(n: BN): Point;
    }

    class Signature {
      static fromDER(sig: Buffer): Signature;
      static fromString(data: string): Signature;
      static SIGHASH_ALL: number;
      static SIGHASH_NONE: number;
      static SIGHASH_SINGLE: number;
      static SIGHASH_FORKID: number;
      static SIGHASH_ANYONECANPAY: number;
      toString(): string;
      toBuffer(): Buffer;
      toDER(): Buffer;
      isTxDER(buf: Buffer): boolean;
      hasLowS(): boolean;
    }
  }

  export namespace Transaction {
    interface IUnspentOutput {
      address: string;
      txId: string;
      outputIndex: number;
      script: string;
      satoshis: number;
    }
    class UnspentOutput {
      static fromObject(o: IUnspentOutput): UnspentOutput;
      constructor(data: IUnspentOutput);
      inspect(): string;
      toObject(): IUnspentOutput;
      toString(): string;
    }

    class Output {
      readonly script: Script;
      readonly satoshis: number;
      readonly satoshisBN: crypto.BN;
      spentTxId: string | null;
      constructor(data: object);

      setScript(script: Script | string | Buffer): this;
      inspect(): string;
      toObject(): object;
    }

    class Input {
      readonly prevTxId: Buffer;
      readonly outputIndex: number;
      readonly sequenceNumber: number;
      readonly script: Script;
      output?: Output;
      constructor(params: object);
      isValidSignature(tx: Transaction, sig: any): boolean;
      setScript(script: Script): this;
    }

    class Signature {
      constructor(arg: Signature | string | object);

      signature: crypto.Signature;
      publicKey: PublicKey;
      prevTxId: Buffer;
      outputIndex: number;
      inputIndex: number;
      sigtype: number;
    }

    namespace Sighash {
      function sighashPreimage(
        transaction: Transaction,
        sighashType: number,
        inputNumber: number,
        subscript: Script,
        satoshisBN: crypto.BN,
        flags: number
      ): Buffer;
      function sighash(
        transaction: Transaction,
        sighashType: number,
        inputNumber: number,
        subscript: Script,
        satoshisBN: crypto.BN,
        flags: number
      ): Buffer;
      function sign(
        transaction: Transaction,
        sighashType: number,
        inputIndex: number,
        subscript: Script,
        satoshisBN: crypto.BN,
        flags: number
      ): Buffer;
      function verify(
        transaction: Transaction,
        signature: Signature,
        publicKey: PublicKey,
        inputIndex: number,
        subscript: Script,
        satoshisBN: crypto.BN,
        flags: number
      ): boolean;
    }
  }

  export class Transaction {
    inputs: Transaction.Input[];
    outputs: Transaction.Output[];
    readonly id: string;
    readonly hash: string;
    readonly inputAmount: number;
    readonly outputAmount: number;
    nid: string;
    nLockTime: number;

    constructor(serialized?: any);

    from(utxos: Transaction.IUnspentOutput | Transaction.IUnspentOutput[]): this;
    to(address: Address[] | Address | string, amount: number): this;
    change(address: Address | string): this;
    fee(amount: number): this;
    feePerKb(amount: number): this;
    sign(privateKey: PrivateKey[] | string[] | PrivateKey | string): this;
    applySignature(sig: crypto.Signature): this;
    addInput(input: Transaction.Input, outputScript: Script | string, satoshis: number): this;
    addOutput(output: Transaction.Output): this;
    addData(value: Buffer | string): this;
    lockUntilDate(time: Date | number): this;
    lockUntilBlockHeight(height: number): this;

    hasWitnesses(): boolean;
    getFee(): number;
    getChangeOutput(): Transaction.Output | null;
    getLockTime(): Date | number;

    verify(): string | boolean;
    isCoinbase(): boolean;

    enableRBF(): this;
    isRBF(): boolean;

    inspect(): string;
    serialize(): string;

    toObject(): any;
    toBuffer(): Buffer;

    isFullySigned(): boolean;

    getSerializationError(opts?: object): any;
  }

  export class ECIES {
    constructor(opts?: any, algorithm?: string);

    privateKey(privateKey: PrivateKey): ECIES;
    publicKey(publicKey: PublicKey): ECIES;
    encrypt(message: string | Buffer): Buffer;
    decrypt(encbuf: Buffer): Buffer;
  }
  export class Block {
    hash: string;
    height: number;
    transactions: Transaction[];
    header: {
      time: number;
      prevHash: string;
    };

    constructor(data: Buffer | object);
  }

  export class PrivateKey {
    constructor(key?: string | PrivateKey, network?: Networks.Type);

    readonly bn: crypto.BN;

    readonly publicKey: PublicKey;
    readonly compressed: boolean;
    readonly network: Networks.Network;

    toAddress(network: Networks.Type): Address;
    toPublicKey(): PublicKey;
    toString(): string;
    toObject(): object;
    toJSON(): object;
    toWIF(): string;
    toHex(): string;
    toBigNumber(): any; //BN;
    toBuffer(): Buffer;
    inspect(): string;

    static fromString(str: string): PrivateKey;
    static fromWIF(str: string): PrivateKey;
    static fromRandom(netowrk?: string): PrivateKey;
    static fromBuffer(buf: Buffer, network: string | Networks.Type): PrivateKey;
    static fromHex(hex: string, network: string | Networks.Type): PrivateKey;
    static getValidationError(data: string): any | null;
    static isValid(data: string): boolean;
  }

  export class PublicKey {
    constructor(source: string | PublicKey | crypto.Point, extra?: object);

    readonly point: crypto.Point;
    readonly compressed: boolean;
    readonly network: Networks.Network;

    toDER(): Buffer;
    toObject(): object;
    toBuffer(): Buffer;
    toAddress(network?: string | Networks.Type): Address;
    toString(): string;
    toHex(): string;
    inspect(): string;

    static fromPrivateKey(privateKey: PrivateKey): PublicKey;
    static fromBuffer(buf: Buffer, strict?: boolean): PublicKey;
    static fromDER(buf: Buffer, strict?: boolean): PublicKey;
    //static fromPoint(point: Point, compressed: boolean): PublicKey;
    //static fromX(odd: boolean, x: Point): PublicKey;
    static fromString(str: string): PublicKey;
    static fromHex(hex: string): PublicKey;
    static getValidationError(data: string): any | null;
    static isValid(data: string): boolean;
  }

  export class Message {
    constructor(message: string | Buffer);

    readonly messageBuffer: Buffer;

    sign(privateKey: PrivateKey): string;
    verify(address: string | Address, signature: string): boolean;
    toObject(): object;
    toJSON(): string;
    toString(): string;
    inspect(): string;

    static sign(message: string | Buffer, privateKey: PrivateKey): string;
    static verify(message: string | Buffer, address: string | Address, signature: string): boolean;
    static MAGIC_BYTES: Buffer;
    static magicHash(): string;
    static fromString(str: string): Message;
    static fromJSON(json: string): Message;
    static fromObject(obj: object): Message;
  }

  export class Mnemonic {
    constructor(data: string | Array<string>, wordList?: Array<string>);

    readonly wordList: Array<string>;
    readonly phrase: string;

    toSeed(passphrase?: string): Buffer;
    toHDPrivateKey(passphrase: string, network: string | number): HDPrivateKey;
    toString(): string;
    inspect(): string;

    static fromRandom(wordlist?: Array<string>): Mnemonic;
    static fromString(mnemonic: string, wordList?: Array<string>): Mnemonic;
    static isValid(mnemonic: string, wordList?: Array<string>): boolean;
    static fromSeed(seed: Buffer, wordlist: Array<string>): Mnemonic;
  }

  export class HDPrivateKey {
    constructor(data?: string | Buffer | object);

    readonly hdPublicKey: HDPublicKey;

    readonly xprivkey: Buffer;
    readonly xpubkey: Buffer;
    readonly network: Networks.Network;
    readonly depth: number;
    readonly privateKey: PrivateKey;
    readonly publicKey: PublicKey;
    readonly fingerPrint: Buffer;

    derive(arg: string | number, hardened?: boolean): HDPrivateKey;
    deriveChild(arg: string | number, hardened?: boolean): HDPrivateKey;
    deriveNonCompliantChild(arg: string | number, hardened?: boolean): HDPrivateKey;

    toString(): string;
    toObject(): object;
    toJSON(): object;
    toBuffer(): Buffer;
    toHex(): string;
    inspect(): string;

    static fromRandom(): HDPrivateKey;
    static fromString(str: string): HDPrivateKey;
    static fromObject(obj: object): HDPrivateKey;
    static fromSeed(hexa: string | Buffer, network: string | Networks.Type): HDPrivateKey;
    static fromBuffer(buf: Buffer): HDPrivateKey;
    static fromHex(hex: string): HDPrivateKey;
    static isValidPath(arg: string | number, hardened: boolean): boolean;
    static isValidSerialized(data: string | Buffer, network?: string | Networks.Type): boolean;
    static getSerializedError(data: string | Buffer, network?: string | Networks.Type): any | null;
  }

  export class HDPublicKey {
    constructor(arg: string | Buffer | object);

    readonly xpubkey: Buffer;
    readonly network: Networks.Network;
    readonly depth: number;
    readonly publicKey: PublicKey;
    readonly fingerPrint: Buffer;

    derive(arg: string | number, hardened?: boolean): HDPublicKey;
    deriveChild(arg: string | number, hardened?: boolean): HDPublicKey;

    toString(): string;
    toObject(): object;
    toJSON(): object;
    toBuffer(): Buffer;
    toHex(): string;
    inspect(): string;

    static fromString(str: string): HDPublicKey;
    static fromObject(obj: object): HDPublicKey;
    static fromBuffer(buf: Buffer): HDPublicKey;
    static fromHex(hex: string): HDPublicKey;

    static fromHDPrivateKey(hdPrivateKey: HDPrivateKey): HDPublicKey;
    static isValidPath(arg: string | number): boolean;
    static isValidSerialized(data: string | Buffer, network?: string | Networks.Type): boolean;
    static getSerializedError(data: string | Buffer, network?: string | Networks.Type): any | null;
  }

  export namespace Script {
    const types: {
      DATA_OUT: string;
    };
    function buildMultisigOut(publicKeys: PublicKey[], threshold: number, opts: object): Script;
    function buildWitnessMultisigOutFromScript(script: Script): Script;
    function buildMultisigIn(pubkeys: PublicKey[], threshold: number, signatures: Buffer[], opts: object): Script;
    function buildP2SHMultisigIn(pubkeys: PublicKey[], threshold: number, signatures: Buffer[], opts: object): Script;
    function buildPublicKeyHashOut(address: Address): Script;
    function buildPublicKeyOut(pubkey: PublicKey): Script;
    function buildDataOut(data: string | Buffer, encoding?: string): Script;
    function buildScriptHashOut(script: Script): Script;
    function buildPublicKeyIn(signature: crypto.Signature | Buffer, sigtype: number): Script;
    function buildPublicKeyHashIn(publicKey: PublicKey, signature: crypto.Signature | Buffer, sigtype: number): Script;

    function fromAddress(address: string | Address): Script;
    function fromASM(address: string): Script;
    function fromHex(address: string): Script;
    function fromString(address: string): Script;
    function fromBuffer(buffer: Buffer): Script;

    function empty(): Script;
    namespace Interpreter {
      const SCRIPT_ENABLE_SIGHASH_FORKID: any;
    }

    function Interpreter(): {
      verify: (
        inputScript: Script,
        outputScript: Script,
        txn: Transaction,
        nin: number,
        flags: any,
        satoshisBN: crypto.BN
      ) => boolean;
    };
  }

  export class Script {
    constructor(data: string | object);

    set(obj: object): this;

    toBuffer(): Buffer;
    toASM(): string;
    toString(): string;
    toHex(): string;

    isPublicKeyHashOut(): boolean;
    isPublicKeyHashIn(): boolean;

    getPublicKey(): Buffer;
    getPublicKeyHash(): Buffer;

    isPublicKeyOut(): boolean;
    isPublicKeyIn(): boolean;

    isScriptHashOut(): boolean;
    isWitnessScriptHashOut(): boolean;
    isWitnessPublicKeyHashOut(): boolean;
    isWitnessProgram(): boolean;
    isScriptHashIn(): boolean;
    isMultisigOut(): boolean;
    isMultisigIn(): boolean;
    isDataOut(): boolean;
    isSafeDataOut(): boolean;

    getData(): Buffer;
    isPushOnly(): boolean;

    classify(): string;
    classifyInput(): string;
    classifyOutput(): string;

    isStandard(): boolean;

    prepend(obj: any): this;
    add(obj: any): this;

    hasCodeseparators(): boolean;
    removeCodeseparators(): this;

    equals(script: Script): boolean;

    getAddressInfo(): Address | boolean;
    findAndDelete(script: Script): this;
    checkMinimalPush(i: number): boolean;
    getSignatureOperationsCount(accurate: boolean): number;

    toAddress(network?: string): Address;
  }

  export interface Util {
    readonly buffer: {
      reverse(a: any): any;
    };
  }

  export namespace Networks {
    type Type = 'livenet' | 'testnet';

    interface Network {
      readonly name: string;
      readonly alias: string;
    }

    const livenet: Network;
    const mainnet: Network;
    const testnet: Network;

    function add(data: any): Network;
    function remove(network: Network): void;
    function get(args: string | number | Network, keys: string | string[]): Network;
  }

  export class Address {
    readonly hashBuffer: Buffer;
    readonly network: Networks.Network;
    readonly type: string;

    constructor(data: Buffer | Uint8Array | string | object, network?: Networks.Type | string, type?: string);
    static fromString(address: string, network: Networks.Type): Address;
    static fromPublicKey(data: PublicKey, network: Networks.Type): Address;
    static fromPrivateKey(privateKey: PrivateKey, network: Networks.Type): Address;
    static fromPublicKeyHash(hash: Buffer | Uint8Array, network: Networks.Type): Address;
    static fromScriptHash(hash: Buffer | Uint8Array, network: Networks.Type): Address;
    toBuffer(): Buffer;
  }

  export class Unit {
    static fromBTC(amount: number): Unit;
    static fromMilis(amount: number): Unit;
    static fromBits(amount: number): Unit;
    static fromSatoshis(amount: number): Unit;

    constructor(amount: number, unitPreference: string);

    toBTC(): number;
    toMilis(): number;
    toBits(): number;
    toSatoshis(): number;
  }
}

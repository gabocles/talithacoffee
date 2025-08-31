
let BLOCK_SIZE = 16;
  
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');  
class ShopifyMultipass {

  constructor(secret_key) {
    if (!(typeof secret_key == 'string' && secret_key.length > 0)) throw new Error('Invalid Secret');

    var out = sjcl.hash.sha256.hash(secret_key);
    var hash = sjcl.codec.hex.fromBits(out);
    this._encryptionKey = hash.slice(0, 32);
    this._signingKey = hash.slice(BLOCK_SIZE * 2, BLOCK_SIZE * 4);
    
    return this;
  }

    encode(obj) {
        if (!obj) return;
        
        // Store the current time in ISO8601 format.
        // The token will only be valid for a small timeframe around this timestamp.
        obj["created_at"] = new Date().toISOString();
    
        // Serialize the customer data to JSON and encrypt it
        var cipherText = this.encrypt(JSON.stringify(obj));
        // Authenticate
        var signed = this.sign(cipherText);

        var bitArray = cipherText.concat(signed);
        // Convert to string for the token
        var token = sjcl.codec.base64.fromBits(bitArray);
      
        token = token.replace(/\+/g, '-') // Replace + with -
           .replace(/\//g, '_'); // Replace / with _
        
        return token;
    };
    
    generateUrl(obj) {
        return "/account/login/multipass/" + this.encode(obj);
    };
    
    sign(data) {
        
      var mac = new sjcl.misc.hmac(sjcl.codec.hex.toBits(this._signingKey));  
      var signed = mac.mac(data);  
      return signed;
    }

    

  encrypt(plaintext) {
      
     // Use a random IV
    var rand = genRanHex(32);  
    // Convert to a bit Array
    var iv = sjcl.codec.hex.toBits(rand);
   
    // Convert key and data to a bit array
    var key = sjcl.codec.hex.toBits(this._encryptionKey);
    var message = sjcl.codec.utf8String.toBits(plaintext);
    
    // Encrypt AES-128-cbc
    var cipher = new sjcl.cipher.aes(key);  
    var cipherObject = sjcl.mode.cbc.encrypt(cipher, message, iv);
    // Concatenate iv and cipher result
    var encrypted = iv.concat(cipherObject);
      
     return encrypted;
  
    }
 

}
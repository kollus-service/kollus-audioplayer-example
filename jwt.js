var JWT = function() {
  this.base64url = function(source) {
      encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    },
    this.create = function(payload, secret) {
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      var encodedHeader = this.base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
      var encodedData = this.base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));
      var signature = encodedHeader + "." + encodedData;
      signature = CryptoJS.HmacSHA256(signature, secret);
      signature = this.base64url(signature);
      return encodedHeader + '.' + encodedData + '.' + signature;
    },
    this.url = function(mode, token, custom_key) {
      return 'https://v.kr.kollus.com/' + mode + '?jwt=' + token + '&custom_key=' + custom_key;
    },
    this.payload = function(expt, cuid, mck) {
      var expired = parseInt(new Date().getTime() / 1000) + expt;
      return {
        cuid: cuid,
        expt: expired,
        mc: [{
          mckey: mck
        }]
      };
    }
}

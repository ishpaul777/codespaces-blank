export function generateUUID(length) {
  var uuid = "";
  var characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    uuid += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return uuid;
}

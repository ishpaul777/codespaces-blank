export const getErrorMsgByCode = (code) => {
  switch (code) {
    case 4000006:
      return "The provided credentials are invalid. Please try again.";
    case 4040001:
      return "The registration session was expired. Please reload the page and try again.";
    case 4000007:
      return "An account with the same email already exists or please link you github/google ID";
    case 4000010:
      return "Account not active yet. Did you forget to verify your email address?";
    case 4000005:
      return "The password cannot be used because it is to similar to the user identifier";
    case 4000001:
      return "cannot link already existing OpenID connect connection";
    case 1010003:
      return "Please confirm this action by verifying that it is you.";
    case 1050001:
      return "Your changes have been saved";
    case 1010004:
      return "Please complete the second authentication challenge";
    case 4000008:
      return "The provided credentials are invalid. Please try again.";
    case 1060002:
      return "An email containing a recovery link has been sent to the email address you provided";
    case 1060001:
      return "You successfully recovered your account. Please change your password or set up an alternative login method (e.g. social sign in) within the next 3.00 minutes.";
    default:
      return "Something went wrong. Please try again later";
  }
};

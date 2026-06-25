import { createThirdwebClient } from 'thirdweb';

const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? 'e6f3b0b3a82babc9ae65be1c880236e9';

export const client = createThirdwebClient({ clientId });

import { useState } from "react";
import { useSession, signIn, SignInOptions } from "next-auth/react";

interface OneTapSigninOptions {
  parentContainerId?: string;
}

export const OneTapSignin = (options?: OneTapSigninOptions & Pick<SignInOptions, "redirect" | "callbackUrl">) => {
  const { parentContainerId } = options || {};
  const [isLoading, setIsLoading] = useState(false);
  
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (!isLoading) {
        const { google } = window;
        if (google) {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_ID!,
            callback: async (response: any) => {
              setIsLoading(true);
              await signIn("googleonetap", {
                credential: response.credential,
                redirect: true,
                ...options,
              });
              setIsLoading(false);
            },
            prompt_parent_id: parentContainerId,
          });

          google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log("getNotDisplayedReason ::", notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
              console.log("getSkippedReason  ::", notification.getSkippedReason());
            } else if (notification.isDismissedMoment()) {
              console.log("getDismissedReason ::", notification.getDismissedReason());
            }
          });
        }
      }
    },
  });

  return { isLoading };
};

import * as Linking from "expo-linking";
import { useEffect } from "react";

type DeepLinkCallback = (link: string) => void | Promise<void>;

export default function useDeepLinks(onLink: DeepLinkCallback) {
  const url = Linking.useURL();

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();

      if (url && url !== initialUrl) {
        onLink(url);
      }
    })();
  }, [url]);
}

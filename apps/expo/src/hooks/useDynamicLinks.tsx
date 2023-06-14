import dynamicLinks, { FirebaseDynamicLinksTypes } from "@react-native-firebase/dynamic-links";
import { useEffect } from "react";

type DynamicLinkCallback = (link: FirebaseDynamicLinksTypes.DynamicLink) => void | Promise<void>;

export default function useDynamicLinks(onLink: DynamicLinkCallback) {
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(onLink);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const link = await dynamicLinks().getInitialLink();

      if (link) {
        onLink(link);
      }
    })();
  }, []);
}

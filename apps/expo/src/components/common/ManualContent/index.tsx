import { ScrollView } from "react-native";
import RenderHtml from "react-native-render-html";
import { Text } from "react-native";

import RemoteErrorView from "./_remoteErrorView";
import RemoteLoadingView from "./_remoteLoadingView";

import useLayoutWidth from "@/hooks/useLayoutWidth";

type ManualContentProps = {
  manualUrl?: string;
  languageHeader?: string;
};

export default function ManualContent({ manualUrl, languageHeader }: ManualContentProps) {
  // const [onLayout, width] = useLayoutWidth();

  const headers = new Headers();
  if (languageHeader) {
    headers.append("Accept-Language", languageHeader);
  }

  const headersObject: Record<string, string> = {};
  headers.forEach((value: string, key: string | number) => {
    headersObject[key] = value;
  });

  return (
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={{
        alignItems: "center",
        minHeight: "90%",
        marginLeft: "3%",
        paddingRight: "4%",
        paddingLeft: "7%",
      }}
      persistentScrollbar
    >
      {!manualUrl ? (
        <RemoteErrorView />
      ) : (
        <>
          <RenderHtml
            remoteErrorView={() => <RemoteErrorView />}
            remoteLoadingView={() => <RemoteLoadingView />}
            source={{ uri: manualUrl, headers: headersObject }}
          />
        </>
      )}
    </ScrollView>
  );
}

import { ScrollView, Text } from "react-native";
import RenderHtml from "react-native-render-html";

import RemoteErrorView from "./_remoteErrorView";
import RemoteLoadingView from "./_remoteLoadingView";

import useLayoutWidth from "@/hooks/useLayoutWidth";

type ManualContentProps = {
  manualUrl?: string;
  languageHeader?: string;
};

export default function ManualContent({ manualUrl, languageHeader }: ManualContentProps) {
  const [onLayout, width] = useLayoutWidth();

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
      style={{ width: "100%", marginLeft: "0%", paddingRight: "0%", paddingLeft: "0%" }}
      contentContainerStyle={{
        alignItems: "center",
        minHeight: "90%",
        paddingHorizontal: "5%",
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
            contentWidth={width}
          />
        </>
      )}
    </ScrollView>
  );
}

import { ScrollView } from "react-native";
import RenderHtml from "react-native-render-html";

import RemoteErrorView from "./_remoteErrorView";
import RemoteLoadingView from "./_remoteLoadingView";

import useLayoutWidth from "@/hooks/useLayoutWidth";

type ManualContentProps = {
  manualUrl?: string;
};

export default function ManualContent({ manualUrl }: ManualContentProps) {
  const [onLayout, width] = useLayoutWidth();

  return (
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={{
        alignItems: "center",
        minHeight: "90%",
      }}
      onLayout={onLayout}
      persistentScrollbar
    >
      {!manualUrl ? (
        <RemoteErrorView />
      ) : (
        <RenderHtml
          remoteErrorView={() => <RemoteErrorView />}
          remoteLoadingView={() => <RemoteLoadingView />}
          contentWidth={width}
          source={{ uri: manualUrl }}
        />
      )}
    </ScrollView>
  );
}

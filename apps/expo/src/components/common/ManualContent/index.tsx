import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { decode } from 'html-entities';

import RemoteErrorView from './_remoteErrorView';
import RemoteLoadingView from './_remoteLoadingView';

import useLayoutWidth from '@/hooks/useLayoutWidth';

type ManualContentProps = {
  manualUrl?: string;
  languageHeader?: string;
};

export default function ManualContent({ manualUrl = '', languageHeader = '' }: ManualContentProps) {
  const [onLayout, width] = useLayoutWidth();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (manualUrl) {
      const fetchHtmlContent = async () => {
        try {
          setLoading(true);
          setError(false);

          const headers = new Headers();
          if (languageHeader) {
            headers.append('Accept-Language', languageHeader);
          }

          const response = await fetch(manualUrl, { headers });
          const text = await response.text();
          const decodedHtml = decode(text);

          setHtmlContent(decodedHtml);
        } catch (e) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchHtmlContent();
    }
  }, [manualUrl, languageHeader]);

  return (
    <ScrollView
      style={{ width: '100%', marginLeft: '0%', paddingRight: '0%', paddingLeft: '0%' }}
      contentContainerStyle={{
        alignItems: 'center',
        minHeight: '90%',
        paddingHorizontal: '5%',
      }}
      persistentScrollbar
    >
      {loading ? (
        <RemoteLoadingView />
      ) : error || !htmlContent ? (
        <RemoteErrorView />
      ) : (
        <RenderHtml
          source={{ html: htmlContent }}
          contentWidth={width}
          renderersProps={{ htmlParserOptions: { decodeEntities: true } }}
        />
      )}
    </ScrollView>
  );
}

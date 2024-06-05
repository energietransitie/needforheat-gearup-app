import { Text } from "@rneui/themed";

import Box from "@/components/elements/Box";

type StatusMessageProps = {
  label: string;
  message: string;
};

export function StatusMessage({ label, message }: StatusMessageProps) {
  return (
    <Box>
      <Text bold style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Text>{message}</Text>
    </Box>
  );
}

import { ThemeProvider } from "@rneui/themed";
import { render } from "@testing-library/react-native";

import StatusIndicator from "@/components/common/StatusIndicator";

test("StatusIndicator renders loading text", async () => {
  const { findByText } = render(
    <ThemeProvider>
      <StatusIndicator isLoading loadingText="Loading..." />
    </ThemeProvider>
  );

  const text = await findByText("Loading...");

  expect(text).toBeTruthy();
});

test("StatusIndicator does not render loading text", () => {
  const { queryByText } = render(
    <ThemeProvider>
      <StatusIndicator isLoading={false} loadingText="Loading..." />
    </ThemeProvider>
  );

  const text = queryByText("Loading...");

  expect(text).toBeFalsy();
});

test("StatusIndicator renders error text", async () => {
  const { findByText } = render(
    <ThemeProvider>
      <StatusIndicator isError errorText="Something went wrong" />
    </ThemeProvider>
  );

  const text = await findByText("Something went wrong");

  expect(text).toBeTruthy();
});

test("StatusIndicator does not render loading text", () => {
  const { queryByText } = render(
    <ThemeProvider>
      <StatusIndicator isError={false} errorText="Something went wrong" />
    </ThemeProvider>
  );

  const text = queryByText("Something went wrong");

  expect(text).toBeFalsy();
});

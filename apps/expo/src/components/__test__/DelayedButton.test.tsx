import { ThemeProvider } from "@rneui/themed";
import { render } from "@testing-library/react-native";

import DelayedButton from "../common/DelayedButton";

test("DelayedButton", async () => {
  const { findByText } = render(
    <ThemeProvider>
      <DelayedButton timeout={10} title="Waiting" />
    </ThemeProvider>
  );

  const startText = await findByText("Waiting (10)");

  expect(startText).toBeTruthy();
});

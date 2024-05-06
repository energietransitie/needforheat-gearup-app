import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "@rneui/themed";
import { render, waitFor } from "@testing-library/react-native";
import React, { ReactNode } from "react";

import { theme } from "@/lib/theme";
import DeviceListItem from "@/screens/home/DeviceOverviewScreen/_listItem";
import { HomeStackParamList } from "@/types/navigation"; // Adjust the import based on your project structure

// Mock the Burnt module for toast notifications
jest.mock("burnt", () => ({
  toast: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        /* mock data here */
      }),
  })
) as jest.Mock;

type MockNavigationContainerProps = {
  children: ReactNode;
};

describe("DeviceListItem", () => {
  const mockItem = {
    id: 456,
    name: "Test Device Type",
    activated_at: 1714742241,
    latest_upload: 1714742241,
    type: "device_type",
    data_source: {
      id: 1,
      category: "device_type",
      item: { ID: 1, Name: "Test_Device" },
      order: 1,
      installation_url: "https://example.com/installation",
      faq_url: "https://example.com/faq",
      info_url: "https://example.com/info",
      precedes: null,
      upload_schedule: "0 0 * * *",
      notification_threshold: "PT24H",
    },
    connected: 2,
  };

  const mockProps = {
    item: mockItem,
    allItemsDone: true,
    refreshAfter20Seconds: jest.fn(),
  };

  // Define a native stack navigator for testing
  const Stack = createNativeStackNavigator<HomeStackParamList>();

  // Create a mock navigation container with a native stack navigator
  const MockNavigationContainer: React.FC<MockNavigationContainerProps> = ({ children }) => (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="DeviceOverviewScreen"
            component={() => <>{children}</>}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );

  it("renders device name correctly", async () => {
    const { getByText } = render(
      <MockNavigationContainer>
        <DeviceListItem {...mockProps} />
      </MockNavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("Test Device Type")).toBeTruthy();
    });
  });

  // Test rendering of last seen information when device is connected
  it("renders last seen information when device is connected", async () => {
    const { getByText } = render(
      <MockNavigationContainer>
        <DeviceListItem {...mockProps} />
      </MockNavigationContainer>
    );

    await waitFor(() => {
      const expectedLastSeenText = "screens.device_overview.device_list.device_info.last_seen";
      expect(getByText(expectedLastSeenText)).toBeTruthy();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

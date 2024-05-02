import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "@rneui/themed";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
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
    device_type: {
      name: "Test Device Type",
      id: 123,
      installation_manual_url: "https://example.com/installation",
      info_url: "https://example.com/info",
    },
    name: "Test Device",
    id: 456,
    building_id: 789,
    activated_at: new Date("2024-04-15T12:00:00Z"),
    latest_upload: new Date("2024-04-18T09:30:00Z"),
    connected: 2,
    upload_schedule: "0 0 * * *", // Example cron expression
    notification_threshold_duration: "PT24H", // Example ISO 8601 duration (1 day)
    typeCategory: "device_type",
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

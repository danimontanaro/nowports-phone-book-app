import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage, {
  CREATE_CONTACT_TEXT,
  CREATE_FIRST_CONTACT_TEXT,
} from "../index";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const contactsMock = [
  {
    firstName: "Daniela",
    lastName: "montanaro",
    phone: 92815836,
    id: 10,
  },
  {
    firstName: "David",
    lastName: "Paley",
    phone: 12321313,
    id: 18,
  },
  {
    firstName: "Pepe",
    lastName: "Pepinoo",
    phone: 123123,
    id: 2,
  },
  {
    firstName: "rubi",
    lastName: "rubinsteins",
    phone: 1234566,
    id: 1,
  },
];

describe("Home Page component", () => {
  it("renders a list of contacts", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <HomePage contacts={contactsMock} userId="1" />
      </QueryClientProvider>
    );
    contactsMock.forEach((contact) => {
      expect(
        screen.getByText(`${contact.firstName} ${contact.lastName}`)
      ).toBeVisible();
    });

    expect(screen.getByText(CREATE_CONTACT_TEXT)).toBeVisible();
    expect(
      screen.queryByText(CREATE_FIRST_CONTACT_TEXT)
    ).not.toBeInTheDocument();
  });

  it("shows create your first contact text if there is no contacts", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <HomePage contacts={[]} userId="1" />
      </QueryClientProvider>
    );

    expect(screen.queryByText(CREATE_CONTACT_TEXT)).not.toBeInTheDocument();
    expect(screen.getByText(CREATE_FIRST_CONTACT_TEXT)).toBeVisible();
  });
});

import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LoginForm } from "./login-form";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock Supabase Client
const mockSignInWithPassword = vi.fn();
vi.mock("@/shared/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  it("renders the login form correctly", () => {
    const { container } = render(<LoginForm />);
    
    expect(container.querySelector('form')).toBeDefined();
    expect(screen.getAllByText(/sign in/i)).toBeDefined();
  });
});

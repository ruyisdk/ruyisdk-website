import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import Dashboard from "../index";

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(() => {
    callback([{ isIntersecting: true }]);
  }),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("world-map.svg")) {
        return Promise.resolve({
          ok: true,
          text: async () => "<svg><g id='test-map'></g></svg>",
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          last_updated: "2026-07-22T10:00:00Z",
          installs: { total: 1234 },
          downloads_by_categories_v1: {},
        }),
      });
    });
  });

  it("should render Dashboard page title without crashing", () => {
    render(<Dashboard />);
    expect(screen.getByText("RuyiSDK 下载统计")).toBeDefined();
  });

  it("should match component snapshot", () => {
    const { container } = render(<Dashboard />);
    expect(container).toMatchSnapshot();
  });
});

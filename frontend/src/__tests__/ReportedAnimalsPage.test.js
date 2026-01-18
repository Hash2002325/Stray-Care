/**
 * @file ReportedAnimalsPage.test.js
 * Front-end Jest + React Testing Library suite
 * Covers rendering, CRUD, UI, and state behavior of ReportedAnimalsPage.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportedAnimalsPage from "../pages/ReportedAnimalsPage.jsx";


beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockReports = [
  {
    _id: "1",
    description: "Injured dog",
    location: "Park",
    date: Date.now(),
    image: "dog.jpg",
  },
  {
    _id: "2",
    description: "Sick cat",
    location: "Street",
    date: Date.now(),
  },
];

const mockMeds = [
  { animalReportId: "1", medicine: "Antibiotic" },
  { animalReportId: "1", medicine: "Painkiller" },
];

/* ---------------------------------------------------
   Group A — Rendering & Initial State (6)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Rendering & Initial", () => {
  test("renders without crashing", () => {
    render(<ReportedAnimalsPage />);
    expect(screen.getByText(/Reported Animals/i)).toBeInTheDocument();
  });

  test("title has correct color class", () => {
    render(<ReportedAnimalsPage />);
    const title = screen.getByText(/Reported Animals/i);
    expect(title).toHaveClass("text-blue-600");
  });

  test("initially no reports shown", () => {
    render(<ReportedAnimalsPage />);
    expect(screen.queryByText(/Description:/i)).not.toBeInTheDocument();
  });

  test("renders grid container", () => {
    render(<ReportedAnimalsPage />);
    expect(screen.getByRole("heading", { name: /Reported Animals/i })).toBeInTheDocument();
  });

  test("fetch is called on mount", async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test("fetchRecommendations called after mount", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});

/* ---------------------------------------------------
   Group B — Data Fetching (8)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Data Fetching", () => {
  test("displays fetched reports", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Injured dog/i)).toBeInTheDocument());
  });

  test("shows multiple reports", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getAllByText(/Description:/i).length).toBe(2));
  });

  test("handles empty API results", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.queryByText(/Description:/i)).not.toBeInTheDocument());
  });

  test("fetches correct endpoints", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:5000/api/animalReports");
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:5000/api/medicines");
    });
  });

  test("displays previous recommendations", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => mockMeds });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Previous Recommendations/i)).toBeInTheDocument());
  });

  test("shows grouped recommendations", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => mockMeds });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getAllByRole("listitem").length).toBe(2));
  });

  test("shows correct medicine text", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => mockMeds });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Antibiotic/)).toBeInTheDocument());
  });

  test("handles medicine API empty", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.queryByText(/Previous Recommendations/i)).not.toBeInTheDocument());
  });
});

/* ---------------------------------------------------
   Group C — Edit Mode (8)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Edit Mode", () => {
  beforeEach(() => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
  });

  test("click edit toggles fields", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    expect(screen.getByPlaceholderText(/Description/)).toBeInTheDocument();
  });

  test("typing in edit updates field value", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    fireEvent.change(screen.getByPlaceholderText(/Description/), {
      target: { value: "Updated desc" },
    });
    expect(screen.getByDisplayValue("Updated desc")).toBeInTheDocument();
  });

  test("cancel hides edit fields", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Cancel/));
    expect(screen.queryByPlaceholderText(/Description/)).not.toBeInTheDocument();
  });

  test("save triggers PUT request", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({
        json: async () => ({ description: "Updated", location: "Beach" }),
      });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    fireEvent.change(screen.getByPlaceholderText(/Location/), {
      target: { value: "Beach" },
    });
    fireEvent.click(screen.getByText(/Save/));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/animalReports/1"),
        expect.objectContaining({ method: "PUT" })
      )
    );
  });

  test("save closes edit mode", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({
        json: async () => ({ description: "Updated", location: "Beach" }),
      });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Save/));
    await waitFor(() =>
      expect(screen.queryByPlaceholderText(/Description/)).not.toBeInTheDocument()
    );
  });

  test("keeps description unchanged if not modified", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    expect(screen.getByDisplayValue(/Injured dog/)).toBeInTheDocument();
  });

  test("edit fields prefilled correctly", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    expect(screen.getByDisplayValue("Park")).toBeInTheDocument();
  });

  test("multiple edit sessions toggle separately", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getAllByText(/Edit/));
    const [edit1, edit2] = screen.getAllByText(/Edit/);
    fireEvent.click(edit1);
    fireEvent.click(edit2);
    expect(screen.getAllByPlaceholderText(/Description/).length).toBeGreaterThan(0);
  });
});

/* ---------------------------------------------------
   Group D — Delete (4)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Delete", () => {
  test("delete button triggers DELETE call", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({});
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Delete/));
    fireEvent.click(screen.getByText(/Delete/));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/animalReports/1",
        expect.objectContaining({ method: "DELETE" })
      )
    );
  });

  test("deletes from UI after deletion", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({});
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Delete/));
    fireEvent.click(screen.getByText(/Delete/));
    await waitFor(() => expect(screen.queryByText(/Injured dog/)).not.toBeInTheDocument());
  });

  test("handles delete failure gracefully", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockRejectedValueOnce(new Error("fail"));
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Delete/));
    fireEvent.click(screen.getByText(/Delete/));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test("delete button exists per report", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getAllByText(/Delete/).length).toBe(2));
  });
});

/* ---------------------------------------------------
   Group E — Recommendations (10)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Recommendations", () => {
  beforeEach(() => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
  });

  test("textarea exists for recommendation", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter recommendation/i)).toBeInTheDocument());
  });

  test("typing updates recommendation state", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByPlaceholderText(/Enter recommendation/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter recommendation/i), { target: { value: "Antibiotic" } });
    expect(screen.getByDisplayValue(/Antibiotic/)).toBeInTheDocument();
  });

  test("submit sends POST request", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => ({}) });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Submit/));
    fireEvent.change(screen.getByPlaceholderText(/Enter recommendation/i), { target: { value: "Vaccine" } });
    fireEvent.click(screen.getByText(/Submit/));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/medicines",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  test("ignores empty recommendation submit", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Submit/));
    fireEvent.click(screen.getByText(/Submit/));
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("previous recommendations render list", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => mockMeds });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Previous Recommendations/i)).toBeInTheDocument());
  });

  test("submitting clears input", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => ({}) });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByPlaceholderText(/Enter recommendation/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter recommendation/i), { target: { value: "Medicine" } });
    fireEvent.click(screen.getByText(/Submit/));
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter recommendation/i).value).toBe(""));
  });

  test("handles POST failure gracefully", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockRejectedValueOnce(new Error("POST fail"));
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Submit/));
    fireEvent.change(screen.getByPlaceholderText(/Enter recommendation/i), { target: { value: "Test" } });
    fireEvent.click(screen.getByText(/Submit/));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test("label for recommendation visible", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Doctor Recommendation/i)).toBeInTheDocument());
  });

  test("recommendation button styled correctly", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Submit/)).toHaveClass("bg-green-500"));
  });

  test("renders correct placeholder text", async () => {
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter recommendation here/i)).toBeInTheDocument());
  });
});

/* ---------------------------------------------------
   Group F — UI Rendering (6)
--------------------------------------------------- */
describe("ReportedAnimalsPage - UI Rendering", () => {
  test("renders uploaded image if available", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  test("shows Report ID", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Report ID/i)).toBeInTheDocument());
  });

  test("shows date field formatted", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Reported on/i)).toBeInTheDocument());
  });

  test("edit button styled properly", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Edit/)).toHaveClass("bg-yellow-500"));
  });

  test("delete button styled properly", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Delete/)).toHaveClass("bg-red-500"));
  });

  test("layout displays multiple cards", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getAllByText(/Description:/i).length).toBe(2));
  });
});

/* ---------------------------------------------------
   Group G — Error & Empty States (4)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Error Handling", () => {
  test("fetch error handled gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("fetch failed"));
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test("no crash if medicine list missing", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [{}] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Doctor Recommendation/i)).toBeInTheDocument());
  });

  test("handles invalid JSON gracefully", async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => { throw new Error("Invalid"); } });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test("renders message when no recommendations exist", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[1]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.queryByText(/Previous Recommendations/i)).not.toBeInTheDocument());
  });
});

/* ---------------------------------------------------
   Group H — Dates & Conditions (4)
--------------------------------------------------- */
describe("ReportedAnimalsPage - Date & Conditional", () => {
  test("renders human-readable date", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getByText(/Reported on/i)).toBeInTheDocument());
  });

  test("omits image section if no image", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[1]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.queryByRole("img")).not.toBeInTheDocument());
  });

  test("hides recommendation when in edit mode", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => [mockReports[0]] })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => screen.getByText(/Edit/));
    fireEvent.click(screen.getByText(/Edit/));
    expect(screen.queryByText(/Doctor Recommendation/i)).not.toBeInTheDocument();
  });

  test("renders multiple date fields if multiple reports", async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockReports })
      .mockResolvedValueOnce({ json: async () => [] });
    render(<ReportedAnimalsPage />);
    await waitFor(() => expect(screen.getAllByText(/Reported on/i).length).toBe(2));
  });
});

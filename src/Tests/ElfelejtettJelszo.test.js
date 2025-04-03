import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import axios from "axios";
import ElfelejtettJelszo from "../Pages/ElfelejtettJelszo";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("axios");

describe("ElfelejtettJelszo Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Betölti az elfelejtett jelszó oldalt", () => {
        render(
            <MemoryRouter>
                <ElfelejtettJelszo />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("Email cím")).toBeInTheDocument();
    });

    test("Sikeres új jelszó kérés", async () => {
        jest.useFakeTimers();
        axios.post.mockResolvedValue({ data: "Ellenőrizd az emailed a jelszó visszaállításához." });
        render(
            <MemoryRouter>
                <ElfelejtettJelszo />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByPlaceholderText("Email cím"), {
            target: { value: "test@example.com" },
        });
        fireEvent.click(screen.getByRole('button', { name: /Jelszó visszaállítása/i }));

        await waitFor(() => screen.getByText("Ellenőrizd az emailed a jelszó visszaállításához."));
        expect(screen.getByText("Ellenőrizd az emailed a jelszó visszaállításához.")).toBeInTheDocument();
    
        jest.runAllTimers();
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/belepes"));
    });
    

    test("Sikertelen új jelszó kérés", async () => {
        axios.post.mockRejectedValue({ response: { data: "Hiba történt a kérés feldolgozása közben." } });

        render(
            <MemoryRouter>
                <ElfelejtettJelszo />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Email cím"), {
            target: { value: "invalid@example.com" },
        });
        fireEvent.click(screen.getByRole('button', { name: /Jelszó visszaállítása/i }));

        await waitFor(() => screen.getByText("Hiba történt a kérés feldolgozása közben."));
        expect(screen.getByText("Hiba történt a kérés feldolgozása közben.")).toBeInTheDocument();
    });
});

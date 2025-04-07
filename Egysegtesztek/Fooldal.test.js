import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import '@testing-library/jest-dom';
import Fooldal from "../Pages/Fooldal";

jest.mock("axios");

describe("Főoldal Komponens", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Népszerű városok sikeres lekérése és megjelenítése", async () => {
        const mockCities = [
            { nev: "Budapest", kep: "budapest.jpg", leiras: "Főváros" },
            { nev: "Debrecen", kep: "debrecen.jpg", leiras: "Nagyváros" }
        ];
        
        axios.get.mockResolvedValueOnce({ data: mockCities });
        axios.get.mockResolvedValueOnce({ data: [] });
        axios.get.mockResolvedValueOnce({ data: [] });
        
        render(
            <MemoryRouter>
                <Fooldal />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText("Budapest")).toBeInTheDocument();
            expect(screen.getByText("Debrecen")).toBeInTheDocument();
        });
    });

    test("Hiba kezelése városok lekérésekor", async () => {
        axios.get.mockRejectedValueOnce(new Error("Hálózati hiba"));
        axios.get.mockResolvedValueOnce({ data: [] });
        axios.get.mockResolvedValueOnce({ data: [] });
        
        render(
            <MemoryRouter>
                <Fooldal />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/hiba történt a városok betöltése során/i)).toBeInTheDocument();
        });
    });

    test("Kiemelt ingatlanok sikeres lekérése és megjelenítése", async () => {
        const mockProperties = [
            { ingatlanId: 1, cim: "Szép lakás", ar: 100000 },
            { ingatlanId: 2, cim: "Tágas ház", ar: 200000 }
        ];
    
        axios.get.mockResolvedValueOnce({ data: [] });
        axios.get.mockResolvedValueOnce({ data: mockProperties });
        axios.get.mockResolvedValueOnce({ data: [] });
    
        render(
            <MemoryRouter>
                <Fooldal />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.findByText((content, element) => element.textContent.includes("Szép lakás"))).resolves.toBeInTheDocument();
            expect(screen.findByText((content, element) => element.textContent.includes("Tágas ház"))).resolves.toBeInTheDocument();
        });
    });
    

    test("Hiba kezelése kiemelt ingatlanok lekérésekor", async () => {
        axios.get.mockResolvedValueOnce({ data: [] });
        axios.get.mockRejectedValueOnce(new Error("Hálózati hiba"));
        axios.get.mockResolvedValueOnce({ data: [] });
        
        render(
            <MemoryRouter>
                <Fooldal />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/hiba történt az ingatlanok betöltése során/i)).toBeInTheDocument();
        });
    });
});

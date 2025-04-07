import { TextEncoder, TextDecoder } from 'text-encoding';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import axios from "axios";
import { Belepes } from "../Pages/Belepes";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("axios");

describe("Belepes Component", () => {
    beforeEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    test("Betölti a belépés oldalt", () => {
        render(
        <MemoryRouter>
            <Belepes />
        </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("Felhasználónév")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Jelszó")).toBeInTheDocument();
    });

    test("Sikeres belépés", async () => {
        axios.post.mockResolvedValue({ data: { token: "mockToken" } });
        axios.get.mockResolvedValue({ data: { permissionId: "1", id: "123" } });

        render(
        <MemoryRouter>
            <Belepes />
        </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Felhasználónév"), {
        target: { value: "testuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
        target: { value: "password" },
        });
        
        const loginButton = screen.getByRole('button', { name: /Bejelentkezés/i });
        fireEvent.click(loginButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        expect(sessionStorage.getItem("token")).toBe("mockToken");
        expect(mockNavigate).toHaveBeenCalledWith("/profil");
    });

    test("Sikertelen bejelentkezés esetés hibaüzenet", async () => {
        axios.post.mockRejectedValue({ response: { data: "Hibás adatok" } });

        render(
        <MemoryRouter>
            <Belepes />
        </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Felhasználónév"), {
        target: { value: "wronguser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
        target: { value: "wrongpassword" },
        });
        
        const loginButton = screen.getByRole('button', { name: /Bejelentkezés/i });
        fireEvent.click(loginButton);

        await waitFor(() => screen.getByText("Hibás adatok"));
        expect(screen.getByText("Hibás adatok")).toBeInTheDocument();
    });
});
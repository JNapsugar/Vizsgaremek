import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Profil from "../Pages/Profil";
import '@testing-library/jest-dom';

jest.mock("axios");

describe("Profil komponens", () => {
    const mockUserData = {
        loginNev: "testUser",
        email: "test@example.com",
        name: "Test User",
        permissionId: 2,
        profilePicturePath: "img/testUser.jpg"
    };

    beforeEach(() => {
        sessionStorage.setItem("userId", "123");
        sessionStorage.setItem("token", "fakeToken");
        sessionStorage.setItem("username", "testUser");
        
        // Alap mockolt válasz
        axios.get.mockImplementation((url) => {
            if (url.includes('felhasznalo/me')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('Ingatlan/ingatlanok')) {
                return Promise.resolve({ data: [] });
            }
            if (url.includes('Foglalasok/user')) {
                return Promise.resolve({ data: [] });
            }
            if (url.includes('Ingatlankepek')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error('Nem várt API hívás'));
        });
    });

    afterEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    test("megjeleníti a profilt a felhasználói adatokkal", async () => {
        render(
            <MemoryRouter>
                <Profil />
            </MemoryRouter>
        );

        await screen.findByText("Saját profil");

        const usernameElement = await screen.findByText(mockUserData.loginNev, { selector: '.ProfileUsername' });
        expect(usernameElement).toBeInTheDocument();

        const fullName = screen.getByText(mockUserData.name, { selector: '.ProfileFullname' });
        expect(fullName).toBeInTheDocument();

        const email = await screen.findByText(mockUserData.email, { selector: '.profileDataRow span' });
        expect(email).toBeInTheDocument();
    });

    test("lehetővé teszi a profil szerkesztését", async () => {
        render(
            <MemoryRouter>
                <Profil />
            </MemoryRouter>
        );

        const editButton = await screen.findByText("Adatok módosítása");
        fireEvent.click(editButton);

        const nameInput = screen.getByDisplayValue(mockUserData.name);
        fireEvent.change(nameInput, { target: { value: "Updated User" } });

        axios.put.mockResolvedValueOnce({ status: 200 });
        
        const saveButton = screen.getByText("Mentés");
        fireEvent.click(saveButton);

        await waitFor(() => expect(axios.put).toHaveBeenCalled());
    });

    test("kezeli a kijelentkezést", async () => {
        axios.post.mockResolvedValueOnce({ status: 200 });
        render(
            <MemoryRouter>
                <Profil />
            </MemoryRouter>
        );

        const logoutButton = await screen.findByText("Kijelentkezés");
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                "https://localhost:7079/api/Felhasznalo/logout/",
                { LoginNev: mockUserData.loginNev },
                { headers: { Authorization: "Bearer fakeToken" } }
            );
            expect(sessionStorage.getItem("token")).toBeNull();
        });
    });

    test("kezeli a fiók törlését", async () => {
        axios.delete.mockResolvedValueOnce({ status: 200 });
        window.confirm = jest.fn(() => true);
        
        render(
            <MemoryRouter>
                <Profil />
            </MemoryRouter>
        );

        const deleteButton = await screen.findByText("Fiók törlése");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalledWith(
                "Biztosan törölni szeretnéd a fiókodat? Ez visszafordíthatatlan művelet."
            );
            expect(axios.delete).toHaveBeenCalledWith(
                `https://localhost:7079/api/Felhasznalo/delete/${mockUserData.loginNev}`,
                { headers: { Authorization: "Bearer fakeToken" } }
            );
        });
    });
});